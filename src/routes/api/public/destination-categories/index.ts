import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  CATEGORY_COLUMNS,
  categoryInsert,
  categoryPayload,
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
  if (/jwt|invalid claim|unauthori[sz]ed/i.test(msg) || error.code === "PGRST301") {
    return publicError(msg, "unauthorized", 401);
  }
  if (error.code === "42501" || /row-level security|permission denied|policy/i.test(msg)) {
    return publicError(msg, "forbidden", 403);
  }
  return publicError(msg, "query_failed", 500);
}

async function handleList(request: Request) {
  try {
    const { data, error } = await createCmsClient(request)
      .from("destination_categories")
      .select(CATEGORY_COLUMNS)
      .order("position", { ascending: true })
      .order("slug", { ascending: true });
    if (error) return dbFailure(error);
    return okJson(((data ?? []) as DestinationCategoryRow[]).map(categoryPayload));
  } catch (error) {
    return serverFailure(error, "Query failed");
  }
}

async function handleCreate(request: Request) {
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
      .insert(categoryInsert(parsed.value))
      .select(CATEGORY_COLUMNS)
      .single();
    if (error) return dbFailure(error);
    return okJson(categoryPayload(data as DestinationCategoryRow), 201);
  } catch (error) {
    return serverFailure(error, "Create failed");
  }
}

export const Route = createFileRoute("/api/public/destination-categories/")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: ({ request }) => handleList(request),
      POST: ({ request }) => handleCreate(request),
    },
  },
});
