import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  CATEGORY_COLUMNS,
  categoryInsert,
  categoryPayload,
  isCategoryId,
  parseCategoryInput,
  type DestinationCategoryRow,
} from "@/lib/destination-categories";
import { isMissingTable } from "@/lib/site-header";
import {
  missingBearer,
  okJson,
  readJsonBody,
  requireOfferAdmin,
  serverFailure,
} from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

function dbFailure(error: { code?: string; message?: string }) {
  const msg = error.message ?? "Query failed";
  if (isMissingTable(error)) {
    return publicError(
      "Destination categories table does not exist yet — run the create_destination_categories migration",
      "not_found",
      404,
    );
  }
  if (error.code === "23505") {
    return publicError("Another category already uses this id", "duplicate_slug", 409);
  }
  if (error.code === "23514") {
    // Input passed this API's validation, so the table still has an older rule
    // (e.g. the first version only allowed 10 curated icon keys).
    return publicError(
      "The database rejected this category — re-run the latest create_destination_categories migration",
      "invalid_category",
      400,
    );
  }
  if (/jwt|invalid claim|unauthori[sz]ed/i.test(msg) || error.code === "PGRST301") {
    return publicError(msg, "unauthorized", 401);
  }
  if (error.code === "42501" || /row-level security|permission denied|policy/i.test(msg)) {
    return publicError(msg, "forbidden", 403);
  }
  return publicError(msg, "query_failed", 500);
}

async function handleUpdate(request: Request, id: string) {
  if (!isCategoryId(id)) return publicError(`Invalid category id: ${id}`, "invalid_id", 400);
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;
  const read = await readJsonBody(request);
  if (!read.ok) return read.response;
  const parsed = parseCategoryInput(read.body);
  if (!parsed.ok) {
    return publicJson(
      { error: { code: "invalid_category", message: "Category is invalid", issues: parsed.issues } },
      400,
    );
  }

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireOfferAdmin(supabase);
    if (forbidden) return forbidden;
    const { data, error } = await supabase
      .from("destination_categories")
      .update(categoryInsert(parsed.value))
      .eq("id", id)
      .select(CATEGORY_COLUMNS)
      .maybeSingle();
    if (error) return dbFailure(error);
    if (!data) return publicError(`Category not found: ${id}`, "not_found", 404);
    return okJson(categoryPayload(data as DestinationCategoryRow));
  } catch (error) {
    return serverFailure(error, "Update failed");
  }
}

async function handleDelete(request: Request, id: string) {
  if (!isCategoryId(id)) return publicError(`Invalid category id: ${id}`, "invalid_id", 400);
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;
  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireOfferAdmin(supabase);
    if (forbidden) return forbidden;
    const { data, error } = await supabase
      .from("destination_categories")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) return dbFailure(error);
    if (!data) return publicError(`Category not found: ${id}`, "not_found", 404);
    return okJson({ id });
  } catch (error) {
    return serverFailure(error, "Delete failed");
  }
}

export const Route = createFileRoute("/api/public/destination-categories/$id")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      PUT: ({ request, params }) => handleUpdate(request, params.id),
      DELETE: ({ request, params }) => handleDelete(request, params.id),
    },
  },
});
