import { createFileRoute } from "@tanstack/react-router";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  BAGGAGE_PRICE_COLUMNS,
  BAGGAGE_PRICE_TABLE,
  BAGGAGE_WEIGHT_MAX_KG,
  airportsFor,
  baggageDbFailure,
  candidateSegments,
  currencyForPos,
  roundUsd,
  type BaggagePriceRow,
} from "@/lib/baggage-prices";
import { convertAmount, getExchangeRate } from "@/lib/currency-exchange";
import { okJson, serverFailure } from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

/**
 * GET /api/public/baggage-prices/quote?from=&to=&weight=&pos=
 *   The website's Excess Baggage Calculator. `from` / `to` are airport codes
 *   (e.g. DAM, DXB — what the calculator sends) or POS codes (e.g. sy, ae —
 *   mapped to their airports from pos_list.airports, main airport first);
 *   `weight` is the excess kg. The price is the admin's USD price per kg for
 *   the first priced segment × weight.
 *
 *   `pos` is the point of sale in the website's URL (`/kw/en/...`). Its
 *   booking currency (pos_list.currency) is what the visitor pays in, so the
 *   USD total is converted with the booking platform's live rate and returned
 *   as `total` / `currency`. The USD figures stay in the response, and a POS
 *   we cannot convert for simply keeps `currency: "USD"` — the calculator
 *   still answers.
 *
 *   `{ from, to, pos, origin, destination, weightKg, pricePerKgUsd, totalUsd,
 *      pricePerKg, total, currency, rate, rateUpdatedAt, converted }`
 *   404 `not_priced` when no segment between them has a price yet.
 */
async function handleQuote(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = params.get("from")?.trim() ?? "";
  const to = params.get("to")?.trim() ?? "";
  const pos = params.get("pos")?.trim().toLowerCase() ?? "";
  const weightKg = Number(params.get("weight"));

  if (!from || !to) return publicError("from and to are required", "invalid_quote", 400);
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > BAGGAGE_WEIGHT_MAX_KG) {
    return publicError(
      `weight must be a number of kg between 0 and ${BAGGAGE_WEIGHT_MAX_KG}`,
      "invalid_quote",
      400,
    );
  }

  try {
    const supabase = createCmsClient(request);
    let origins: string[];
    let destinations: string[];
    try {
      [origins, destinations] = await Promise.all([
        airportsFor(supabase, from),
        airportsFor(supabase, to),
      ]);
    } catch (lookupError) {
      return baggageDbFailure(lookupError as { code?: string; message: string });
    }
    const candidates = candidateSegments(origins, destinations);
    if (!candidates.length) {
      return publicError(`No route between "${from}" and "${to}"`, "not_priced", 404);
    }

    const { data, error } = await supabase
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
    const totalUsd = roundUsd(pricePerKgUsd * weightKg);

    // What the visitor pays in: the POS's booking currency, converted with the
    // booking platform's rate. Anything missing leaves the quote in USD and
    // says why in `rateError`, rather than failing the calculator.
    const posCurrency = pos ? await currencyForPos(supabase, pos) : null;
    const exchange = posCurrency
      ? await getExchangeRate("USD", posCurrency)
      : ({ ok: false, reason: pos ? "unknown_pos" : "no_pos" } as const);
    const rate = exchange.ok ? exchange.rate : null;

    return okJson({
      from,
      to,
      pos: pos || null,
      posCurrency,
      origin: priced.origin,
      destination: priced.destination,
      weightKg,
      pricePerKgUsd,
      totalUsd,
      pricePerKg: rate ? convertAmount(pricePerKgUsd, rate.rate) : pricePerKgUsd,
      total: rate ? convertAmount(totalUsd, rate.rate) : totalUsd,
      currency: rate ? rate.toCurrency : "USD",
      rate: rate ? rate.rate : null,
      rateUpdatedAt: rate ? rate.updatedAt : null,
      converted: Boolean(rate) && rate!.toCurrency !== "USD",
      rateError: exchange.ok ? null : exchange.reason,
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
