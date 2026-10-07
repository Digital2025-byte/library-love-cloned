import { createFileRoute } from "@tanstack/react-router";
import {
  publicError,
  publicJson,
  requireBearer,
  writeFailure,
} from "@/lib/cms-public-http";
import { createCmsClient } from "./get-pages";
import { normalizeLang } from "@/lib/cms-languages";
import {
  descriptionWithDraftLang,
  draftLangsFromDescription,
} from "@/lib/page-language-drafts";

const PAGE_STATUSES = ["draft", "published"] as const;
type PageStatus = (typeof PAGE_STATUSES)[number];

type StatusBody = {
  id?: string;
  slug?: string;
  status?: string;
  lang?: string;
};

const PAGE_COLUMNS = "id, slug, label, description, status, created_at, updated_at";

type PageRow = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

/** Supabase rejects a malformed/expired bearer — report 401 so clients re-authenticate. */
function dbFailure(message: string) {
  if (/jwt|token is expired|invalid.*token/i.test(message)) {
    return publicError(message, "unauthorized", 401);
  }
  return writeFailure(new Error(message), "Status change failed");
}

function pagePayload(row: PageRow) {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    description: row.description,
    status: row.status,
    isPublished: row.status === "published",
    draftLangs: draftLangsFromDescription(row.description),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * POST|PATCH /api/public/update-page-status
 *   { id | slug, status: draft | published, lang?: en | ar }
 *
 * Without `lang`: switches the whole page (every language) between draft and
 * published. With `lang`: keeps just that language as draft (or publishes it
 * again) via the `[[draft:…]]` description marker — see page-language-drafts.
 * A language shows on the website only when the page AND that language are
 * published. Admin only: the caller's bearer
 * token is forwarded to Supabase and the `pages` RLS (`is_admin()`) authorizes.
 * RLS filters a non-admin UPDATE to 0 rows without an error, so an empty result
 * on a page that exists is reported as 403.
 */
async function handleStatus(request: Request) {
  if (!requireBearer(request)) {
    return publicError(
      "Authorization: Bearer <supabase-access-token> is required",
      "unauthorized",
      401,
    );
  }

  let body: StatusBody;
  try {
    body = (await request.json()) as StatusBody;
  } catch {
    return publicError("Request body must be JSON", "invalid_json", 400);
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim().toLowerCase() : "";
  const lang = body.lang === undefined ? null : normalizeLang(String(body.lang));

  if (!id && !slug) {
    return publicError("Missing required field: id or slug", "missing_page", 400);
  }
  if (!PAGE_STATUSES.includes(status as PageStatus)) {
    return publicError(
      `Field \`status\` must be one of: ${PAGE_STATUSES.join(", ")}`,
      "invalid_status",
      400,
    );
  }
  if (body.lang !== undefined && !lang) {
    return publicError("Field `lang` must be one of: en, ar", "invalid_lang", 400);
  }

  try {
    const supabase = createCmsClient(request);
    const match = id ? { column: "id", value: id } : { column: "slug", value: slug };

    const current = await supabase
      .from("pages")
      .select(PAGE_COLUMNS)
      .eq(match.column, match.value)
      .maybeSingle();
    if (current.error) return dbFailure(current.error.message);
    if (!current.data) {
      return publicError(`Page "${id || slug}" was not found`, "not_found", 404);
    }
    const row = current.data as unknown as PageRow;
    const patch = lang
      ? { description: descriptionWithDraftLang(row.description, lang, status === "draft") }
      : { status };
    const unchanged = lang
      ? (patch.description ?? null) === (row.description ?? null)
      : row.status === status;
    if (unchanged) {
      return publicJson({ data: pagePayload(row), meta: { changed: false, lang } });
    }

    const { data, error } = await supabase
      .from("pages")
      .update(patch)
      .eq("id", row.id)
      .select(PAGE_COLUMNS);
    if (error) return dbFailure(error.message);
    if (!data?.length) {
      return publicError(
        "Only CMS admins can change a page's status",
        "forbidden",
        403,
      );
    }

    return publicJson({
      data: pagePayload(data[0] as unknown as PageRow),
      meta: { changed: true, lang, generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return writeFailure(error, "Status change failed");
  }
}

export const Route = createFileRoute("/api/public/update-page-status")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      POST: ({ request }) => handleStatus(request),
      PATCH: ({ request }) => handleStatus(request),
    },
  },
});
