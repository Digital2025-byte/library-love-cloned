import { createFileRoute } from "@tanstack/react-router";
import { deleteComponentFromPage } from "@/lib/cms.functions";
import {
  publicError,
  publicJson,
  requireBearer,
  writeFailure,
} from "@/lib/cms-public-http";
import { createCmsClient } from "./get-pages";

type DeleteBody = {
  slug?: string;
  uid?: string;
  componentId?: string;
};

function readUid(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function runDelete(request: Request, slug: string, uid: string) {
  if (!requireBearer(request)) {
    return publicError(
      "Authorization: Bearer <supabase-access-token> is required",
      "unauthorized",
      401,
    );
  }
  if (!slug) {
    return publicError("Missing required field: slug", "missing_slug", 400);
  }
  if (!uid) {
    return publicError("Missing required field: uid", "missing_uid", 400);
  }

  try {
    const result = await deleteComponentFromPage(createCmsClient(request), {
      slug,
      uid,
    });
    return publicJson({
      data: result,
      meta: { generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return writeFailure(error, "Delete failed");
  }
}

export const Route = createFileRoute("/api/public/delete-component")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      DELETE: async ({ request }) => {
        const url = new URL(request.url);
        return runDelete(
          request,
          url.searchParams.get("slug")?.trim() ?? "",
          url.searchParams.get("uid")?.trim() ||
            url.searchParams.get("componentId")?.trim() ||
            "",
        );
      },
      POST: async ({ request }) => {
        let body: DeleteBody;
        try {
          body = (await request.json()) as DeleteBody;
        } catch {
          return publicError("Request body must be JSON", "invalid_json", 400);
        }
        return runDelete(
          request,
          typeof body.slug === "string" ? body.slug.trim() : "",
          readUid(body.uid) || readUid(body.componentId),
        );
      },
    },
  },
});
