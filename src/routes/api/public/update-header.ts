import { createFileRoute } from "@tanstack/react-router";
import { normalizeLang } from "@/lib/cms-languages";
import { publicError, publicJson, requireBearer } from "@/lib/cms-public-http";
import {
  SITE_HEADER_COLUMNS,
  headerPayload,
  isMissingTable,
  parseHeaderDocument,
  type SiteHeaderRow,
} from "@/lib/site-header";
import { createCmsClient } from "./get-pages";

type UpdateHeaderBody = {
  lang?: unknown;
  document?: unknown;
  version?: unknown;
};

type DbError = { code?: string; message: string };

function ok(row: SiteHeaderRow) {
  return publicJson({
    data: headerPayload(row),
    meta: { generatedAt: new Date().toISOString() },
  });
}

function conflict(currentVersion: number) {
  return publicJson(
    {
      error: {
        code: "version_conflict",
        message:
          "The header was saved by someone else since you loaded it. Reload to get the latest version.",
        currentVersion,
      },
    },
    409,
  );
}

/** Map a PostgREST error to the contract's status codes. */
function dbFailure(error: DbError) {
  const msg = error.message ?? "Query failed";
  if (/jwt|invalid claim|unauthori[sz]ed/i.test(msg) || error.code === "PGRST301") {
    return publicError(msg, "unauthorized", 401);
  }
  if (error.code === "42501" || /row-level security|permission denied|policy/i.test(msg)) {
    return publicError(msg, "forbidden", 403);
  }
  if (isMissingTable(error)) {
    return publicError(
      "Site header table does not exist yet — run the site_header migration",
      "not_found",
      404,
    );
  }
  return publicError(msg, "query_failed", 500);
}

async function handleUpdate(request: Request) {
  if (!requireBearer(request)) {
    return publicError(
      "Authorization: Bearer <supabase-access-token> is required",
      "unauthorized",
      401,
    );
  }

  let body: UpdateHeaderBody;
  try {
    body = (await request.json()) as UpdateHeaderBody;
  } catch {
    return publicError("Request body must be JSON", "invalid_json", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return publicError("Request body must be a JSON object", "invalid_json", 400);
  }

  const lang = normalizeLang(body.lang);
  if (!lang) {
    return publicError('Field `lang` must be "en" or "ar"', "invalid_lang", 400);
  }

  // `version` = the version the editor loaded. null/absent means "I started
  // from the bundled default" (GET returned 404) → only valid while no row exists.
  const version = body.version ?? null;
  if (version !== null && !(Number.isInteger(version) && (version as number) >= 1)) {
    return publicError(
      "Field `version` must be a positive integer (or null when the header was never saved)",
      "invalid_version",
      400,
    );
  }

  const parsed = parseHeaderDocument(body.document);
  if (!parsed.ok) {
    return publicJson(
      {
        error: {
          code: "invalid_document",
          message: `Header document is invalid (${parsed.issues.length} issue${parsed.issues.length === 1 ? "" : "s"})`,
          issues: parsed.issues,
        },
      },
      400,
    );
  }
  const document = parsed.document;

  try {
    const supabase = createCmsClient(request);

    // RLS turns a non-admin UPDATE into a silent 0-row update, which would be
    // indistinguishable from a version conflict — so check the role first.
    const admin = await supabase.rpc("is_admin");
    if (admin.error) return dbFailure(admin.error);
    if (admin.data !== true) {
      return publicError("Only CMS admins can update the site header", "forbidden", 403);
    }

    // Optimistic concurrency: only the row still at the loaded version moves.
    // (updated_at / updated_by = auth.uid() are stamped by the table trigger.)
    if (version !== null) {
      const updated = await supabase
        .from("site_header")
        .update({ data: document, version: (version as number) + 1 })
        .eq("lang", lang)
        .eq("version", version)
        .select(SITE_HEADER_COLUMNS)
        .maybeSingle();
      if (updated.error) return dbFailure(updated.error);
      if (updated.data) return ok(updated.data as SiteHeaderRow);
    }

    // 0 rows updated (or no version sent): conflict vs. missing row.
    const current = await supabase
      .from("site_header")
      .select("version")
      .eq("lang", lang)
      .maybeSingle();
    if (current.error) return dbFailure(current.error);
    if (current.data) {
      return conflict((current.data as { version: number }).version);
    }

    // Row missing → create it at version 1.
    const inserted = await supabase
      .from("site_header")
      .insert({ lang, data: document, version: 1 })
      .select(SITE_HEADER_COLUMNS)
      .single();
    if (inserted.error) {
      // Lost an insert race with another editor → report it as a conflict.
      if (inserted.error.code === "23505") {
        const again = await supabase
          .from("site_header")
          .select("version")
          .eq("lang", lang)
          .maybeSingle();
        return conflict((again.data as { version: number } | null)?.version ?? 1);
      }
      return dbFailure(inserted.error);
    }
    return ok(inserted.data as SiteHeaderRow);
  } catch (error) {
    return publicError(
      error instanceof Error ? error.message : "Update failed",
      "query_failed",
      500,
    );
  }
}

export const Route = createFileRoute("/api/public/update-header")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      PUT: ({ request }) => handleUpdate(request),
      POST: ({ request }) => handleUpdate(request),
    },
  },
});
