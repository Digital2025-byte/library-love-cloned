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

export const Route = createFileRoute("/api/public/get-pages")({
  server: {
    handlers: {
      OPTIONS: () => json({}),
      GET: async ({ request }) => {
        const supabase = createCmsClient(request);
        const { data, error } = await supabase
          .from("pages")
          .select("slug, label, description, status")
          .order("slug", { ascending: true });

        if (error) return json({ error: error.message }, 500);
        return json(data ?? []);
      },
    },
  },
});
