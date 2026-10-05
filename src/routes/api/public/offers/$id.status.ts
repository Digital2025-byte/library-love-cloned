import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  OFFER_COLUMNS,
  OFFER_STATUSES,
  isOfferId,
  isPastExpiry,
  offerPayload,
  parseOfferStatus,
  type OfferRow,
} from "@/lib/offers";
import {
  missingBearer,
  offerDbFailure,
  offerNotFound,
  okJson,
  readJsonBody,
  requireOfferAdmin,
  serverFailure,
} from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

/**
 * PATCH /api/public/offers/:id/status  { status: draft | active | inactive }
 * Activating an offer whose end date / passenger limit is already reached is
 * refused (409 offer_expired) — extend the expiry first.
 */
async function handleStatus(request: Request, id: string) {
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;
  if (!isOfferId(id)) return publicError(`Invalid offer id: ${id}`, "invalid_id", 400);

  const read = await readJsonBody(request);
  if (!read.ok) return read.response;
  const status = parseOfferStatus(read.body);
  if (!status) {
    return publicError(
      `Field \`status\` must be one of: ${OFFER_STATUSES.join(", ")}`,
      "invalid_status",
      400,
    );
  }

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireOfferAdmin(supabase);
    if (forbidden) return forbidden;

    const current = await supabase.from("offers").select(OFFER_COLUMNS).eq("id", id).maybeSingle();
    if (current.error) return offerDbFailure(current.error);
    if (!current.data) return offerNotFound(id);
    const row = current.data as unknown as OfferRow;

    if (status === "active" && isPastExpiry(row)) {
      return publicError(
        "This offer has already expired — extend its end date or passenger limit before activating it",
        "offer_expired",
        409,
      );
    }
    if (row.status === status) return okJson(offerPayload(row));

    const { data, error } = await supabase
      .from("offers")
      .update({ status })
      .eq("id", id)
      .select(OFFER_COLUMNS)
      .maybeSingle();
    if (error) return offerDbFailure(error);
    if (!data) return offerNotFound(id);
    return okJson(offerPayload(data as unknown as OfferRow));
  } catch (error) {
    return serverFailure(error, "Status change failed");
  }
}

export const Route = createFileRoute("/api/public/offers/$id/status")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      PATCH: ({ request, params }) => handleStatus(request, params.id),
    },
  },
});
