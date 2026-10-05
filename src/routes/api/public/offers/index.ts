import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson, requireBearer } from "@/lib/cms-public-http";
import {
  OFFER_COLUMNS,
  OFFER_STATUSES,
  OFFER_TYPES,
  offerPayload,
  parseOfferInput,
  type OfferRow,
} from "@/lib/offers";
import {
  invalidOffer,
  missingBearer,
  offerDbFailure,
  okJson,
  readJsonBody,
  requireOfferAdmin,
  serverFailure,
} from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

/**
 * GET /api/public/offers?type=&status=&search=
 *   Anonymous callers get live offers only (RLS: status = active, then the
 *   derived state filters out scheduled / expired ones). An admin bearer sees
 *   every offer.
 */
async function handleList(request: Request) {
  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const status = params.get("status");
  const search = params.get("search")?.trim() ?? "";

  if (type && !(OFFER_TYPES as readonly string[]).includes(type)) {
    return publicError(`Unsupported type "${type}"`, "invalid_type", 400);
  }
  if (status && !(OFFER_STATUSES as readonly string[]).includes(status)) {
    return publicError(`Unsupported status "${status}"`, "invalid_status", 400);
  }

  try {
    let query = createCmsClient(request)
      .from("offers")
      .select(OFFER_COLUMNS)
      .order("created_at", { ascending: false });
    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);
    if (search) {
      // Strip PostgREST filter syntax characters from the free-text needle.
      const needle = search.replace(/[%,()*]/g, " ").slice(0, 60);
      query = query.or(
        `code.ilike.%${needle}%,title_en.ilike.%${needle}%,title_ar.ilike.%${needle}%`,
      );
    }

    const { data, error } = await query;
    if (error) return offerDbFailure(error);

    let offers = ((data ?? []) as unknown as OfferRow[]).map(offerPayload);
    if (!requireBearer(request)) offers = offers.filter((offer) => offer.state === "active");
    return okJson(offers);
  } catch (error) {
    return serverFailure(error, "Query failed");
  }
}

/** POST /api/public/offers — create (admin). */
async function handleCreate(request: Request) {
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;

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
      .insert(parsed.offer)
      .select(OFFER_COLUMNS)
      .single();
    if (error) return offerDbFailure(error);
    return okJson(offerPayload(data as unknown as OfferRow), 201);
  } catch (error) {
    return serverFailure(error, "Create failed");
  }
}

export const Route = createFileRoute("/api/public/offers/")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: ({ request }) => handleList(request),
      POST: ({ request }) => handleCreate(request),
    },
  },
});
