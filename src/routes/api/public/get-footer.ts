import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_LANGUAGE, normalizeLang } from "@/lib/cms-languages";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  SITE_FOOTER_COLUMNS,
  footerPayload,
  isMissingTable,
  type SiteFooterRow,
} from "@/lib/site-footer";
import { createCmsClient } from "./get-pages";

/** Public + CDN-cacheable: the footer changes rarely and must load fast. */
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
};

export const Route = createFileRoute("/api/public/get-footer")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: async ({ request }) => {
        // `lang` is optional (default en); an unsupported value is a 400.
        const raw = new URL(request.url).searchParams.get("lang");
        const lang = raw === null || raw.trim() === "" ? DEFAULT_LANGUAGE : normalizeLang(raw);
        if (!lang) {
          return publicError(`Unsupported lang "${raw}" (expected en or ar)`, "invalid_lang", 400);
        }

        let row: SiteFooterRow | null;
        try {
          // Public anon-RLS read: never forward the caller's Authorization header
          // (an expired admin JWT would otherwise fail the read with a 500).
          const { data, error } = await createCmsClient(new Request(request.url))
            .from("site_footer")
            .select(SITE_FOOTER_COLUMNS)
            .eq("lang", lang)
            .maybeSingle();
          if (error) {
            // Table not migrated yet → same as "no row" so clients fall back
            // to their bundled default instead of surfacing an error.
            if (isMissingTable(error)) {
              return publicError("Site footer table does not exist yet", "not_found", 404);
            }
            return publicError(error.message, "query_failed", 500);
          }
          row = data as SiteFooterRow | null;
        } catch (error) {
          return publicError(
            error instanceof Error ? error.message : "Query failed",
            "query_failed",
            500,
          );
        }

        if (!row) {
          return publicError(`Site footer not found for lang: ${lang}`, "not_found", 404);
        }

        return publicJson(
          {
            data: footerPayload(row),
            meta: { generatedAt: new Date().toISOString() },
          },
          200,
          CACHE_HEADERS,
        );
      },
    },
  },
});
