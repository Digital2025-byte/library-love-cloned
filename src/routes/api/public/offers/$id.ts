import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  OFFER_COLUMNS,
  isOfferId,
  offerPayload,
  parseOfferInput,
  type OfferRow,
} from "@/lib/offers";
import {
  invalidOffer,
  missingBearer,
  offerDbFailure,
  offerNotFound,
  okJson,
  readJsonBody,
  requireOfferAdmin,
  serverFailure,
} from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

const invalidId = (id: string) => publicError(`Invalid offer id: ${id}`, "invalid_id", 400);

/** GET /api/public/offers/:id (RLS: anonymous callers see active offers only). */
async function handleGet(request: Request, id: string) {
  if (!isOfferId(id)) return invalidId(id);
  try {
    const { data, error } = await createCmsClient(request)
      .from("offers")
      .select(OFFER_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) return offerDbFailure(error);
    if (!data) return offerNotFound(id);
    return okJson(offerPayload(data as unknown as OfferRow));
  } catch (error) {
    return serverFailure(error, "Query failed");
  }
}

/** PUT /api/public/offers/:id — replace the editable fields (admin). */
async function handleUpdate(request: Request, id: string) {
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;
  if (!isOfferId(id)) return invalidId(id);

  const read = await readJsonBody(request);
  if (!read.ok) return read.response;
  const parsed = parseOfferInput(read.body);
  if (!parsed.ok) return invalidOffer(parsed.issues);

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireOfferAdmin(supabase);
    if (forbidden) return forbidden;

    const { data, error } = await supabase
      .from("offers")
      .update(parsed.offer)
      .eq("id", id)
      .select(OFFER_COLUMNS)
      .maybeSingle();
    if (error) return offerDbFailure(error);
    if (!data) return offerNotFound(id);
    return okJson(offerPayload(data as unknown as OfferRow));
  } catch (error) {
    return serverFailure(error, "Update failed");
  }
}

/** DELETE /api/public/offers/:id (admin). */
async function handleDelete(request: Request, id: string) {
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;
  if (!isOfferId(id)) return invalidId(id);

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireOfferAdmin(supabase);
    if (forbidden) return forbidden;

    const { data, error } = await supabase.from("offers").delete().eq("id", id).select("id");
    if (error) return offerDbFailure(error);
    if (!data || data.length === 0) return offerNotFound(id);
    return okJson({ id });
  } catch (error) {
    return serverFailure(error, "Delete failed");
  }
}

export const Route = createFileRoute("/api/public/offers/$id")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: ({ request, params }) => handleGet(request, params.id),
      PUT: ({ request, params }) => handleUpdate(request, params.id),
      DELETE: ({ request, params }) => handleDelete(request, params.id),
    },
  },
});
