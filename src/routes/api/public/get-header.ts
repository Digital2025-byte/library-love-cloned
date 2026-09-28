import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_LANGUAGE, normalizeLang } from "@/lib/cms-languages";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  SITE_HEADER_COLUMNS,
  headerPayload,
  isMissingTable,
  type SiteHeaderRow,
} from "@/lib/site-header";
import { createCmsClient } from "./get-pages";

/** Public + CDN-cacheable: the header changes rarely and must load fast. */
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
};

export const Route = createFileRoute("/api/public/get-header")({
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

        let row: SiteHeaderRow | null;
        try {
          const { data, error } = await createCmsClient(request)
            .from("site_header")
            .select(SITE_HEADER_COLUMNS)
            .eq("lang", lang)
            .maybeSingle();
          if (error) {
            // Table not migrated yet → same as "no row" so clients fall back
            // to their bundled default instead of surfacing an error.
            if (isMissingTable(error)) {
              return publicError("Site header table does not exist yet", "not_found", 404);
            }
            return publicError(error.message, "query_failed", 500);
          }
          row = data as SiteHeaderRow | null;
        } catch (error) {
          return publicError(
            error instanceof Error ? error.message : "Query failed",
            "query_failed",
            500,
          );
        }

        if (!row) {
          return publicError(`Site header not found for lang: ${lang}`, "not_found", 404);
        }

        return publicJson(
          {
            data: headerPayload(row),
            meta: { generatedAt: new Date().toISOString() },
          },
          200,
          CACHE_HEADERS,
        );
      },
    },
  },
});
