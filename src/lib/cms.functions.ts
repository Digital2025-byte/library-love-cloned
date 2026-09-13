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

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type CmsBlock = {
  uid: string;
  sectionId: string;
  position: number;
  style: { [key: string]: Json };
  content: { [key: string]: Json };
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
      .select("slug, label, description, status, page_components(id)")
      .order("slug", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((page) => ({
      slug: page.slug,
      label: page.label,
      description: page.description,
      status: page.status,
      componentCount: Array.isArray(page.page_components)
        ? page.page_components.length
        : 0,

    }));
  },
);

type ComponentRow = {
  id: string;
  type: string;
  style: unknown;
  content: unknown;
};

/** A page↔component link row with the component nested under it. */
type PageComponentRow = {
  position: number;
  components: ComponentRow | ComponentRow[] | null;
};

/** PostgREST may type an embedded one-to-one row as an array. */
function firstComponent(row: PageComponentRow): ComponentRow | null {
  const c = row.components;
  if (!c) return null;
  return Array.isArray(c) ? (c[0] ?? null) : c;
}


function toBlock(row: ComponentRow, position: number): CmsBlock {
  return {
    uid: row.id,
    sectionId: row.type,
    position,
    style: (row.style ?? {}) as { [key: string]: Json },
    content: (row.content ?? {}) as { [key: string]: Json },
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
        "id, slug, label, description, status, page_components(position, components(id, type, style, content))",
      )
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!page) return null;

    const blocks = ((page.page_components ?? []) as PageComponentRow[])
      .slice()
      .sort((a, b) => a.position - b.position)
      .flatMap((link) =>
        link.components ? [toBlock(link.components, link.position)] : [],
      );

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
 * Create one component instance and link it to a page. Admin-only: RLS rejects
 * the writes for anyone without the admin role.
 */
export const createCmsComponent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      slug: string;
      type: string;
      position?: number;
      style?: { [key: string]: Json };
      content?: { [key: string]: Json };
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

    // Append to the end of this page unless an explicit position was requested.
    let position = data.position;
    if (position === undefined) {
      const { data: last, error: lastError } = await supabase
        .from("page_components")
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
        type: data.type,
        position,
        style: data.style as never,
        content: data.content as never,
      })
      .select("id, type, style, content")
      .single();

    if (error) throw new Error(error.message);

    const { error: linkError } = await supabase
      .from("page_components")
      .insert({ page_id: page.id, component_id: row.id, position });

    if (linkError) throw new Error(linkError.message);

    return toBlock(row as ComponentRow, position);
  });


