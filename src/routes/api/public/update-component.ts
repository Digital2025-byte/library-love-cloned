import { createFileRoute } from "@tanstack/react-router";
import {
  asJsonMap,
  updateComponentForPage,
  type Json,
} from "@/lib/cms.functions";
import {
  publicError,
  publicJson,
  requireBearer,
  writeFailure,
} from "@/lib/cms-public-http";
import { createCmsClient } from "./get-pages";

type UpdateBody = {
  slug?: string;
  uid?: string;
  componentId?: string;
  type?: string;
  position?: number;
  style?: { [key: string]: Json };
  content?: { [key: string]: Json };
};

export const Route = createFileRoute("/api/public/update-component")({
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

        let body: UpdateBody;
        try {
          body = (await request.json()) as UpdateBody;
        } catch {
          return publicError("Request body must be JSON", "invalid_json", 400);
        }

        const slug = typeof body.slug === "string" ? body.slug.trim() : "";
        const uid =
          typeof body.uid === "string"
            ? body.uid.trim()
            : typeof body.componentId === "string"
              ? body.componentId.trim()
              : "";

        if (!slug) {
          return publicError("Missing required field: slug", "missing_slug", 400);
        }
        if (!uid) {
          return publicError("Missing required field: uid", "missing_uid", 400);
        }

        const payload: Parameters<typeof updateComponentForPage>[1] = {
          slug,
          uid,
        };
        if (typeof body.type === "string") payload.type = body.type;
        if (typeof body.position === "number") payload.position = body.position;
        if (body.style !== undefined) payload.style = asJsonMap(body.style);
        if (body.content !== undefined) payload.content = asJsonMap(body.content);

        try {
          const block = await updateComponentForPage(
            createCmsClient(request),
            payload,
          );
          return publicJson({
            data: block,
            meta: { generatedAt: new Date().toISOString() },
          });
        } catch (error) {
          return writeFailure(error, "Update failed");
        }
      },
    },
  },
});
