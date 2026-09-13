import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type CmsPageSummary = {
  slug: string;
  label: string;
  description: string | null;
  status: string;
  componentCount: number;
};

export type CmsBlock = {
  uid: string;
  sectionId: string;
  position: number;
  style: Record<string, unknown>;
  content: Record<string, unknown>;
};

export type CmsPageDetail = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  status: string;
  blocks: CmsBlock[];
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

type ComponentRow = {
  id: string;
  type: string;
  position: number;
  style: unknown;
  content: unknown;
};

function toBlock(row: ComponentRow): CmsBlock {
  return {
    uid: row.id,
    sectionId: row.type,
    position: row.position,
    style: (row.style ?? {}) as Record<string, unknown>,
    content: (row.content ?? {}) as Record<string, unknown>,
  };
}

/** A single page with its ordered component instances. */
export const getCmsPage = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => {
    if (!input?.slug) throw new Error("slug is required");
    return { slug: input.slug };
  })
  .handler(async ({ data }): Promise<CmsPageDetail | null> => {
    const supabase = createPublicClient();
    const { data: page, error } = await supabase
      .from("pages")
      .select(
        "id, slug, label, description, status, components(id, type, position, style, content)",
      )
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!page) return null;

    const blocks = ((page.components ?? []) as ComponentRow[])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(toBlock);

    return {
      id: page.id,
      slug: page.slug,
      label: page.label,
      description: page.description,
      status: page.status,
      blocks,
    };
  });

/**
 * Create one component instance on a page. Admin-only: RLS rejects the insert
 * for anyone without the admin role.
 */
export const createCmsComponent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      slug: string;
      type: string;
      position?: number;
      style?: Record<string, unknown>;
      content?: Record<string, unknown>;
    }) => {
      if (!input?.slug) throw new Error("slug is required");
      if (!input?.type) throw new Error("type is required");
      return {
        slug: input.slug,
        type: input.type,
        position: input.position,
        style: input.style ?? {},
        content: input.content ?? {},
      };
    },
  )
  .handler(async ({ data, context }): Promise<CmsBlock> => {
    const { supabase } = context;

    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();

    if (pageError) throw new Error(pageError.message);
    if (!page) throw new Error(`Page not found: ${data.slug}`);

    // Append to the end unless an explicit position was requested.
    let position = data.position;
    if (position === undefined) {
      const { data: last, error: lastError } = await supabase
        .from("components")
        .select("position")
        .eq("page_id", page.id)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lastError) throw new Error(lastError.message);
      position = last ? last.position + 1 : 0;
    }

    const { data: row, error } = await supabase
      .from("components")
      .insert({
        page_id: page.id,
        type: data.type,
        position,
        style: data.style as never,
        content: data.content as never,
      })
      .select("id, type, position, style, content")
      .single();

    if (error) throw new Error(error.message);
    return toBlock(row as ComponentRow);
  });

