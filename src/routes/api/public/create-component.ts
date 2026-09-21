import { createFileRoute } from "@tanstack/react-router";
import {
  asJsonMap,
  createComponentForPage,
  type Json,
} from "@/lib/cms.functions";
import {
  publicError,
  publicJson,
  requireBearer,
  writeFailure,
} from "@/lib/cms-public-http";
import { createCmsClient } from "./get-pages";

type CreateBody = {
  slug?: string;
  type?: string;
  lang?: string;
  position?: number;
  style?: { [key: string]: Json };
  content?: { [key: string]: Json };
};

export const Route = createFileRoute("/api/public/create-component")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      POST: async ({ request }) => {
        if (!requireBearer(request)) {
          return publicError(
            "Authorization: Bearer <supabase-access-token> is required",
            "unauthorized",
            401,
          );
        }

        let body: CreateBody;
        try {
          body = (await request.json()) as CreateBody;
        } catch {
          return publicError("Request body must be JSON", "invalid_json", 400);
        }

        const slug = typeof body.slug === "string" ? body.slug.trim() : "";
        const type = typeof body.type === "string" ? body.type.trim() : "";
        if (!slug) {
          return publicError("Missing required field: slug", "missing_slug", 400);
        }
        if (!type) {
          return publicError("Missing required field: type", "missing_type", 400);
        }

        const payload: Parameters<typeof createComponentForPage>[1] = {
          slug,
          type,
          style: asJsonMap(body.style),
          content: asJsonMap(body.content),
        };
        if (typeof body.lang === "string") payload.lang = body.lang;
        if (typeof body.position === "number") payload.position = body.position;

        try {
          const block = await createComponentForPage(
            createCmsClient(request),
            payload,
          );
          return publicJson(
            { data: block, meta: { generatedAt: new Date().toISOString() } },
            201,
          );
        } catch (error) {
          return writeFailure(error, "Create failed");
        }
      },
    },
  },
});
