import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

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

/** Publishable-key client. Forwards a caller bearer token so an admin session sees drafts. */
export function createCmsClient(request: Request) {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const bearer = request.headers.get("authorization");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        if (bearer) headers.set("Authorization", bearer);
        else if (key.startsWith("sb_")) headers.delete("Authorization");
        return fetch(input as RequestInfo, { ...init, headers });
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
  page_components: { id: string }[] | null;
};

export const Route = createFileRoute("/api/public/get-pages")({
  server: {
    handlers: {
      OPTIONS: () => json({}),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");

        const supabase = createCmsClient(request);
        let query = supabase
          .from("pages")
          .select(
            "id, slug, label, description, status, created_at, updated_at, page_components(id)"
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
        const pages = rows.map((page) => ({
          id: page.id,
          slug: page.slug,
          label: page.label,
          description: page.description,
          status: page.status,
          isPublished: page.status === "published",
          componentCount: page.page_components?.length ?? 0,
          createdAt: page.created_at,
          updatedAt: page.updated_at,
        }));

        return json({
          data: pages,
          meta: {
            count: pages.length,
            publishedCount: pages.filter((p) => p.isPublished).length,
            draftCount: pages.filter((p) => !p.isPublished).length,
            filters: { status: status || null },
            generatedAt: new Date().toISOString(),
          },
        });
      },
    },
  },
});
