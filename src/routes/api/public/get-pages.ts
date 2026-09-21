import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { ensureWindowsSystemCa } from "@/lib/trust-windows-ca";
import { dirFor, normalizeLang } from "@/lib/cms-languages";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type, apikey",
      "Cache-Control": "no-store",
    },
  });
}

function fetchErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause;
  if (cause instanceof Error) {
    const code =
      "code" in cause && typeof cause.code === "string" ? ` (${cause.code})` : "";
    return `${error.message}: ${cause.message}${code}`;
  }
  return error.message;
}

/** Publishable-key client. Forwards a caller bearer token so an admin session sees drafts. */
export function createCmsClient(request: Request) {
  ensureWindowsSystemCa();
  const url =
    process.env["SUPABASE_URL"] ||
    (import.meta.env["VITE_SUPABASE_URL"] as string | undefined);
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined);
  if (!url || !key) {
    throw new Error(
      `Missing Supabase environment variable(s): ${[
        ...(!url ? ["SUPABASE_URL"] : []),
        ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
      ].join(", ")}.`,
    );
  }
  const bearer = request.headers.get("authorization");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        if (bearer) headers.set("Authorization", bearer);
        else if (key.startsWith("sb_")) headers.delete("Authorization");
        return fetch(input as RequestInfo, { ...init, headers }).catch(
          (error: unknown) => {
            throw new Error(`Supabase request failed (${fetchErrorMessage(error)})`, {
              cause: error,
            });
          },
        );
      },
    },
  });
}

type PageRow = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  page_components: { id: string; lang: string }[] | null;
};

export const Route = createFileRoute("/api/public/get-pages")({
  server: {
    handlers: {
      OPTIONS: () => json({}),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        // Page summaries carry no localized content; `lang` is accepted and
        // echoed so the list request shares the same locale contract as get-page.
        const lang = normalizeLang(url.searchParams.get("lang"));

        const supabase = createCmsClient(request);
        let query = supabase
          .from("pages")
          .select(
            "id, slug, label, description, status, created_at, updated_at, page_components(id, lang)"
          )
          .order("slug", { ascending: true });

        if (status) query = query.eq("status", status);

        const { data, error } = await query;

        if (error)
          return json(
            { error: { message: error.message, code: "query_failed" } },
            500
          );

        const rows = (data ?? []) as unknown as PageRow[];
        const pages = rows.map((page) => {
          const links = page.page_components ?? [];
          // With `lang`, count only that language's components (blocks are
          // per-language now); without it, count them all.
          const componentCount = lang
            ? links.filter((link) => link.lang === lang).length
            : links.length;
          return {
            id: page.id,
            slug: page.slug,
            label: page.label,
            description: page.description,
            status: page.status,
            isPublished: page.status === "published",
            componentCount,
            createdAt: page.created_at,
            updatedAt: page.updated_at,
          };
        });

        return json({
          data: pages,
          meta: {
            count: pages.length,
            publishedCount: pages.filter((p) => p.isPublished).length,
            draftCount: pages.filter((p) => !p.isPublished).length,
            filters: { status: status || null, lang },
            lang,
            dir: dirFor(lang),
            generatedAt: new Date().toISOString(),
          },
        });
      },
    },
  },
});
