import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  BAGGAGE_PRICE_COLUMNS,
  BAGGAGE_PRICE_TABLE,
  BAGGAGE_WEIGHT_MAX_KG,
  airportsFor,
  baggageDbFailure,
  candidateSegments,
  roundUsd,
  type BaggagePriceRow,
} from "@/lib/baggage-prices";
import { okJson, serverFailure } from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

/**
 * GET /api/public/baggage-prices/quote?from=&to=&weight=
 *   The website's Excess Baggage Calculator. `from` / `to` are POS codes
 *   (e.g. sy, ae — mapped to their airports, main airport first) or airport
 *   codes (e.g. DAM, DXB); `weight` is the excess kg. The price is the admin's
 *   USD price per kg for the first priced segment × weight:
 *   `{ from, to, origin, destination, weightKg, pricePerKgUsd, totalUsd, currency }`.
 *   404 `not_priced` when no segment between them has a price yet.
 */
async function handleQuote(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = params.get("from")?.trim() ?? "";
  const to = params.get("to")?.trim() ?? "";
  const weightKg = Number(params.get("weight"));

  if (!from || !to) return publicError("from and to are required", "invalid_quote", 400);
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > BAGGAGE_WEIGHT_MAX_KG) {
    return publicError(
      `weight must be a number of kg between 0 and ${BAGGAGE_WEIGHT_MAX_KG}`,
      "invalid_quote",
      400,
    );
  }

  const origins = airportsFor(from);
  const destinations = airportsFor(to);
  const candidates = candidateSegments(origins, destinations);
  if (!candidates.length) {
    return publicError(`No route between "${from}" and "${to}"`, "not_priced", 404);
  }

  try {
    const { data, error } = await createCmsClient(request)
      .from(BAGGAGE_PRICE_TABLE)
      .select(BAGGAGE_PRICE_COLUMNS)
      .in("origin", origins)
      .in("destination", destinations);
    if (error) return baggageDbFailure(error);

    const rows = (data ?? []) as unknown as BaggagePriceRow[];
    const priced = candidates
      .map(({ origin, destination }) =>
        rows.find((row) => row.origin === origin && row.destination === destination),
      )
      .find(Boolean);
    if (!priced) {
      return publicError(`No baggage price set for ${from} → ${to} yet`, "not_priced", 404);
    }

    const pricePerKgUsd = Number(priced.price_per_kg_usd);
    return okJson({
      from,
      to,
      origin: priced.origin,
      destination: priced.destination,
      weightKg,
      pricePerKgUsd,
      totalUsd: roundUsd(pricePerKgUsd * weightKg),
      currency: "USD",
    });
  } catch (error) {
    return serverFailure(error, "Quote failed");
  }
}

export const Route = createFileRoute("/api/public/baggage-prices/quote")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: ({ request }) => handleQuote(request),
    },
  },
});
