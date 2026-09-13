import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type CmsPageSummary = {
  slug: string;
  label: string;
  description: string | null;
  status: string;
  componentCount: number;
};

/** Publishable-key client for public, RLS-respecting reads. */
function createPublicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        if (key.startsWith("sb_")) headers.delete("Authorization");
        return fetch(input as RequestInfo, { ...init, headers });
      },
    },
  });
}

/** Published pages plus how many components each one holds. */
export const getCmsPages = createServerFn({ method: "GET" }).handler(
  async (): Promise<CmsPageSummary[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("pages")
      .select("slug, label, description, status, components(id)")
      .order("slug", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((page) => ({
      slug: page.slug,
      label: page.label,
      description: page.description,
      status: page.status,
      componentCount: Array.isArray(page.components) ? page.components.length : 0,
    }));
  },
);
