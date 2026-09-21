import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { ensureWindowsSystemCa } from "@/lib/trust-windows-ca";
import {
  DEFAULT_LANGUAGE,
  mergeStyleMaps,
  normalizeLang,
} from "@/lib/cms-languages";

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

/** Public block shape used by GET /api/public/get-page and write APIs. */
export type CmsPublicBlock = {
  uid: string;
  linkId: string;
  sectionId: string;
  sectionLabel: string | null;
  position: number;
  order: number;
  languages: string[];
  style: { [key: string]: Json };
  content: { [key: string]: Json };
  createdAt: string;
  updatedAt: string;
};

export type CreateCmsComponentInput = {
  slug: string;
  type: string;
  /** Language this component belongs to on the page ("en" | "ar"). */
  lang?: string;
  position?: number;
  style?: { [key: string]: Json };
  content?: { [key: string]: Json };
};

export type UpdateCmsComponentInput = {
  slug: string;
  uid: string;
  type?: string;
  position?: number;
  style?: { [key: string]: Json };
  content?: { [key: string]: Json };
};

export type DeleteCmsComponentInput = {
  slug: string;
  uid: string;
};

export type DeleteCmsComponentResult = {
  slug: string;
  uid: string;
  linkId: string;
};


export type CmsPageDetail = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  status: string;
  blocks: CmsBlock[];
};


function supabasePublicEnv() {
  const url =
    process.env["SUPABASE_URL"] ||
    (import.meta.env["VITE_SUPABASE_URL"] as string | undefined);
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined);

  if (!url || !key) {
    const missing = [
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}.`,
    );
  }

  return { url, key };
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

/** Publishable-key client for public, RLS-respecting reads. */
function createPublicClient() {
  ensureWindowsSystemCa();
  const { url, key } = supabasePublicEnv();

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
        return fetch(input as RequestInfo, { ...init, headers }).catch(
          (error: unknown) => {
            throw new Error(
              `Supabase request failed (${fetchErrorMessage(error)})`,
              { cause: error },
            );
          },
        );
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
  lang?: string;
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

function isJsonMap(value: unknown): value is { [key: string]: Json } {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** Copy every own enumerable key — do not drop nested style/content fields. */
export function asJsonMap(value: unknown): { [key: string]: Json } {
  if (!isJsonMap(value)) return {};
  return { ...value };
}

function languagesOf(content: { [key: string]: Json }): string[] {
  return Object.keys(content);
}

function typeLabel(
  types: { label: string } | { label: string }[] | null | undefined,
): string | null {
  if (!types) return null;
  const row = Array.isArray(types) ? types[0] : types;
  return row?.label ?? null;
}

/**
 * Keep languages the client did not send (e.g. `ar` while editing `en`).
 * Each sent language object is stored in full, not field-patched.
 */
function mergeContentMaps(
  existing: unknown,
  incoming: { [key: string]: Json },
): { [key: string]: Json } {
  return { ...asJsonMap(existing), ...incoming };
}

type ComponentDetailRow = ComponentRow & {
  created_at: string;
  updated_at: string;
  component_types: { label: string } | { label: string }[] | null;
};

export function toPublicBlock(
  component: ComponentDetailRow,
  link: { id: string; position: number },
  order: number,
): CmsPublicBlock {
  const content = asJsonMap(component.content);
  const style = asJsonMap(component.style);
  return {
    uid: component.id,
    linkId: link.id,
    sectionId: component.type,
    sectionLabel: typeLabel(component.component_types),
    position: link.position,
    order,
    languages: languagesOf(content),
    style,
    content,
    createdAt: component.created_at,
    updatedAt: component.updated_at,
  };
}

type CmsWriteClient = {
  from: ReturnType<typeof createPublicClient>["from"];
};

async function requirePageId(supabase: CmsWriteClient, slug: string): Promise<string> {
  const { data: page, error } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!page) throw new Error(`Page not found: ${slug}`);
  return page.id;
}

async function requirePageLink(
  supabase: CmsWriteClient,
  pageId: string,
  uid: string,
  slug: string,
) {
  const { data: link, error } = await supabase
    .from("page_components")
    .select("id, position, page_id, component_id, lang")
    .eq("page_id", pageId)
    .eq("component_id", uid)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!link) {
    throw new Error(`Component ${uid} is not on page ${slug}`);
  }
  return link;
}

async function publicBlockForLink(
  supabase: CmsWriteClient,
  uid: string,
  link: { id: string; position: number; page_id: string; lang: string },
): Promise<CmsPublicBlock> {
  const { data: row, error: rowError } = await supabase
    .from("components")
    .select(
      "id, type, style, content, created_at, updated_at, component_types(label)",
    )
    .eq("id", uid)
    .single();
  if (rowError) throw new Error(rowError.message);

  // Order is within the same language's blocks only.
  const { data: siblings, error: siblingError } = await supabase
    .from("page_components")
    .select("id")
    .eq("page_id", link.page_id)
    .eq("lang", link.lang)
    .order("position", { ascending: true });
  if (siblingError) throw new Error(siblingError.message);

  const order = (siblings ?? []).findIndex((item) => item.id === link.id);
  return toPublicBlock(
    row as ComponentDetailRow,
    { id: link.id, position: link.position },
    order < 0 ? 0 : order,
  );
}

/**
 * Create one component instance and attach it to `slug`.
 */
export async function createComponentForPage(
  supabase: CmsWriteClient,
  data: CreateCmsComponentInput,
): Promise<CmsPublicBlock> {
  const pageId = await requirePageId(supabase, data.slug);
  // The component belongs to one language of the page; position is ordered
  // within that language only.
  const lang = normalizeLang(data.lang) ?? DEFAULT_LANGUAGE;

  let position = data.position;
  if (position === undefined) {
    const { data: last, error: lastError } = await supabase
      .from("page_components")
      .select("position")
      .eq("page_id", pageId)
      .eq("lang", lang)
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
      style: asJsonMap(data.style) as never,
      content: asJsonMap(data.content) as never,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const { data: link, error: linkError } = await supabase
    .from("page_components")
    .insert({ page_id: pageId, component_id: row.id, position, lang })
    .select("id, position, page_id, lang")
    .single();
  if (linkError) throw new Error(linkError.message);

  return publicBlockForLink(supabase, row.id, link);
}

/**
 * Remove a component from `slug` only. The `components` row is never deleted.
 */
export async function deleteComponentFromPage(
  supabase: CmsWriteClient,
  data: DeleteCmsComponentInput,
): Promise<DeleteCmsComponentResult> {
  const pageId = await requirePageId(supabase, data.slug);
  const link = await requirePageLink(supabase, pageId, data.uid, data.slug);

  const { error: unlinkError } = await supabase
    .from("page_components")
    .delete()
    .eq("id", link.id);
  if (unlinkError) throw new Error(unlinkError.message);

  return {
    slug: data.slug,
    uid: data.uid,
    linkId: link.id,
  };
}

/**
 * Update one component that is already linked to `slug`. Replaces `style` and
 * language-merges `content` so unedited locales are not wiped.
 */
export async function updateComponentForPage(
  supabase: CmsWriteClient,
  data: UpdateCmsComponentInput,
): Promise<CmsPublicBlock> {
  const pageId = await requirePageId(supabase, data.slug);
  const link = await requirePageLink(supabase, pageId, data.uid, data.slug);

  const patch: {
    type?: string;
    position?: number;
    style?: never;
    content?: never;
  } = {};

  if (data.type) patch.type = data.type;
  if (data.position !== undefined) patch.position = data.position;
  if (data.style !== undefined || data.content !== undefined) {
    // Fetch the current row once so both content and style language-merge
    // (an edit to one locale must not wipe the other, and style migrates from
    // a legacy flat object to a per-language map on first per-language edit).
    const { data: current, error: currentError } = await supabase
      .from("components")
      .select("content, style")
      .eq("id", data.uid)
      .maybeSingle();
    if (currentError) throw new Error(currentError.message);
    if (data.content !== undefined) {
      patch.content = mergeContentMaps(current?.content, data.content) as never;
    }
    if (data.style !== undefined) {
      patch.style = mergeStyleMaps(current?.style, data.style) as never;
    }
  }

  if (Object.keys(patch).length > 0) {
    const { error: updateError } = await supabase
      .from("components")
      .update(patch)
      .eq("id", data.uid);
    if (updateError) throw new Error(updateError.message);
  }

  const nextPosition =
    data.position !== undefined ? data.position : link.position;
  if (data.position !== undefined && data.position !== link.position) {
    const { error: linkUpdateError } = await supabase
      .from("page_components")
      .update({ position: data.position })
      .eq("id", link.id);
    if (linkUpdateError) throw new Error(linkUpdateError.message);
  }

  return publicBlockForLink(supabase, data.uid, {
    id: link.id,
    position: nextPosition,
    page_id: link.page_id,
    lang: link.lang,
  });
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
        "id, slug, label, description, status, page_components(position, lang, components(id, type, style, content))",
      )
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!page) return null;

    // Blocks are per-language; this internal reader is English-first.
    const blocks = ((page.page_components ?? []) as PageComponentRow[])
      .filter((link) => (link.lang ?? DEFAULT_LANGUAGE) === DEFAULT_LANGUAGE)
      .slice()
      .sort((a, b) => a.position - b.position)
      .flatMap((link) => {
        const component = firstComponent(link);
        return component ? [toBlock(component, link.position)] : [];
      });


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
  .inputValidator((input: CreateCmsComponentInput) => {
    if (!input?.slug) throw new Error("slug is required");
    if (!input?.type) throw new Error("type is required");
    const data: CreateCmsComponentInput = {
      slug: input.slug,
      type: input.type,
      style: asJsonMap(input.style),
      content: asJsonMap(input.content),
    };
    if (input.lang) data.lang = input.lang;
    if (input.position !== undefined) data.position = input.position;
    return data;
  })
  .handler(async ({ data, context }): Promise<CmsBlock> => {
    const block = await createComponentForPage(context.supabase, data);
    return {
      uid: block.uid,
      sectionId: block.sectionId,
      position: block.position,
      style: block.style,
      content: block.content,
    };
  });

/**
 * Update one component on a page. Admin-only. Same payload shape as
 * createCmsComponent, plus `uid` of the instance to edit.
 *
 * `style` and `content` are stored in full (every key the client sends).
 * Languages omitted from `content` are kept so editing English does not
 * wipe Arabic.
 */
export const updateCmsComponent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: UpdateCmsComponentInput) => {
    if (!input?.slug) throw new Error("slug is required");
    if (!input?.uid) throw new Error("uid is required");
    const data: UpdateCmsComponentInput = {
      slug: input.slug,
      uid: input.uid,
    };
    if (input.type) data.type = input.type;
    if (input.position !== undefined) data.position = input.position;
    if (input.style !== undefined) data.style = asJsonMap(input.style);
    if (input.content !== undefined) data.content = asJsonMap(input.content);
    return data;
  })
  .handler(async ({ data, context }): Promise<CmsPublicBlock> => {
    return updateComponentForPage(context.supabase, data);
  });

/**
 * Remove a component from a page. Admin-only. The page builder uses this RPC.
 */
export const deleteCmsComponent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: DeleteCmsComponentInput) => {
    if (!input?.slug) throw new Error("slug is required");
    if (!input?.uid) throw new Error("uid is required");
    return { slug: input.slug, uid: input.uid };
  })
  .handler(async ({ data, context }): Promise<DeleteCmsComponentResult> => {
    return deleteComponentFromPage(context.supabase, data);
  });


