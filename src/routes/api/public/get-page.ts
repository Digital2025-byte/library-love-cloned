import { createFileRoute } from "@tanstack/react-router";
import { createCmsClient } from "./get-pages";
import {
  dirFor,
  normalizeLang,
  pickLanguage,
  styleForLang,
} from "@/lib/cms-languages";
import {
  callerIsAdmin,
  draftLangsFromDescription,
} from "@/lib/page-language-drafts";

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

type ComponentRow = {
  id: string;
  type: string;
  style: unknown;
  content: unknown;
  created_at: string;
  updated_at: string;
  component_types: { label: string } | { label: string }[] | null;
};

type PageComponentRow = {
  id: string;
  position: number;
  lang: string;
  components: ComponentRow | ComponentRow[] | null;
};

/** PostgREST may type an embedded one-to-one row as an array. */
function firstComponent(row: PageComponentRow): ComponentRow | null {
  const c = row.components;
  if (!c) return null;
  return Array.isArray(c) ? (c[0] ?? null) : c;
}

function typeLabel(component: ComponentRow): string | null {
  const t = component.component_types;
  if (!t) return null;
  const row = Array.isArray(t) ? t[0] : t;
  return row?.label ?? null;
}

/** Language keys present in a component's content map, e.g. ["en","ar"]. */
function languagesOf(content: unknown): string[] {
  if (!content || typeof content !== "object" || Array.isArray(content))
    return [];
  return Object.keys(content as Record<string, unknown>);
}

export const Route = createFileRoute("/api/public/get-page")({
  server: {
    handlers: {
      OPTIONS: () => json({}),
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;
        const slug = searchParams.get("slug");
        // Optional locale: when given, each block's `content` AND `style` are
        // narrowed to just that language (`{ [lang]: {...} }`; content is `{}`
        // when unauthored, style falls back to the shared/legacy flat style).
        // Without `lang` the full per-language maps are returned.
        const lang = normalizeLang(searchParams.get("lang"));
        if (!slug)
          return json(
            {
              error: {
                message: "Missing required query param: slug",
                code: "missing_slug",
              },
            },
            400
          );

        const supabase = createCmsClient(request);
        const { data, error } = await supabase
          .from("pages")
          .select(
            "id, slug, label, description, status, created_at, updated_at, page_components(id, position, lang, components(id, type, style, content, created_at, updated_at, component_types(label)))"
          )
          .eq("slug", slug)
          .maybeSingle();

        if (error)
          return json(
            { error: { message: error.message, code: "query_failed" } },
            500
          );
        if (!data)
          return json(
            {
              error: {
                message: `Page not found: ${slug}`,
                code: "page_not_found",
              },
            },
            404
          );

        // A language kept as draft (`[[draft:ar]]`) is hidden from everyone
        // but CMS admins — the public site then shows "page not found" there.
        const draftLangs = draftLangsFromDescription(data.description);
        const hiddenLangs =
          draftLangs.length && !(await callerIsAdmin(supabase, request))
            ? draftLangs
            : [];
        if (lang && (hiddenLangs as string[]).includes(lang))
          return json(
            {
              error: {
                message: `Page not published in "${lang}": ${slug}`,
                code: "page_not_found",
              },
            },
            404
          );

        // Blocks are per-language: when `lang` is given, return only that
        // language's components. Without `lang` (legacy callers) return them all.
        const links = ((data.page_components ?? []) as PageComponentRow[])
          .filter((link) => !lang || link.lang === lang)
          .filter((link) => !(hiddenLangs as string[]).includes(link.lang))
          .slice()
          .sort((a, b) => a.position - b.position);

        const blocks = links.flatMap((link, index) => {
          const component = firstComponent(link);
          if (!component) return [];
          const fullContent = component.content ?? {};
          const fullStyle = component.style ?? {};
          // With `lang`: only that language's objects (content `{}` when
          // unauthored; style resolved from per-language map or legacy flat).
          // Without: the full per-language maps.
          let content: unknown = fullContent;
          let style: unknown = fullStyle;
          if (lang) {
            const picked = pickLanguage(fullContent, lang);
            content = picked ? { [lang]: picked } : {};
            style = { [lang]: styleForLang(fullStyle, lang) };
          }
          return [
            {
              uid: component.id,
              linkId: link.id,
              sectionId: component.type,
              sectionLabel: typeLabel(component),
              position: link.position,
              order: index,
              // Every language authored for this component (independent of `lang`).
              languages: languagesOf(fullContent),
              style,
              content,
              createdAt: component.created_at,
              updatedAt: component.updated_at,
            },
          ];
        });

        return json({
          id: data.id,
          slug: data.slug,
          label: data.label,
          description: data.description,
          status: data.status,
          isPublished: data.status === "published",
          draftLangs,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          blocks,
          meta: {
            blockCount: blocks.length,
            sectionIds: [...new Set(blocks.map((b) => b.sectionId))],
            languages: [...new Set(blocks.flatMap((b) => b.languages))],
            lang,
            dir: dirFor(lang),
            generatedAt: new Date().toISOString(),
          },
        });
      },
    },
  },
});
