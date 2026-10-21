/**
 * Baggage prices — shared by the /api/public/baggage-prices* routes.
 *
 * One `baggage_segment_prices` row is one directed flight segment (IATA origin
 * → destination, e.g. DAM → DXB) and its price for 1 kg of baggage in USD, set
 * in the admin's Offers & Baggage Calculator. The website's Excess Baggage
 * Calculator asks for a quote (route + kg) and the price is computed here.
 */
import { publicError } from "@/lib/cms-public-http";
import { isMissingTable } from "@/lib/site-header";

export const BAGGAGE_PRICE_TABLE = "baggage_segment_prices";
export const BAGGAGE_PRICE_COLUMNS = "origin, destination, price_per_kg_usd, updated_at";
/** Mirrors the table CHECK on price_per_kg_usd. */
export const BAGGAGE_PRICE_MAX = 100000;
export const BAGGAGE_WEIGHT_MAX_KG = 1000;

export type BaggagePriceRow = {
  origin: string;
  destination: string;
  price_per_kg_usd: number | string;
  updated_at: string;
};

export function baggagePricePayload(row: BaggagePriceRow) {
  return {
    key: `${row.origin}-${row.destination}`,
    origin: row.origin,
    destination: row.destination,
    pricePerKgUsd: Number(row.price_per_kg_usd),
    updatedAt: row.updated_at,
  };
}

const IATA = /^[A-Z]{3}$/;
const twoDecimals = (value: number) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;
export const roundUsd = (value: number) => Math.round(value * 100) / 100;

type BaggagePriceInput = {
  origin?: unknown;
  destination?: unknown;
  pricePerKgUsd?: unknown;
};

type ParsedPrice =
  | { ok: true; row: { origin: string; destination: string; price_per_kg_usd: number } }
  | { ok: false; message: string };

/** PUT body: `{ origin, destination, pricePerKgUsd }` (IATA codes, USD per 1 kg). */
export function parseBaggagePriceInput(body: unknown): ParsedPrice {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Request body must be a JSON object" };
  }
  const input = body as BaggagePriceInput;
  const origin = String(input.origin ?? "").trim().toUpperCase();
  const destination = String(input.destination ?? "").trim().toUpperCase();
  const price = Number(input.pricePerKgUsd);

  if (!IATA.test(origin)) return { ok: false, message: "origin must be a 3-letter airport code (e.g. DAM)" };
  if (!IATA.test(destination)) {
    return { ok: false, message: "destination must be a 3-letter airport code (e.g. DXB)" };
  }
  if (origin === destination) return { ok: false, message: "origin and destination must differ" };
  if (input.pricePerKgUsd === null || input.pricePerKgUsd === "" || !Number.isFinite(price)) {
    return { ok: false, message: "pricePerKgUsd must be a number" };
  }
  if (price < 0 || price > BAGGAGE_PRICE_MAX) {
    return { ok: false, message: `pricePerKgUsd must be between 0 and ${BAGGAGE_PRICE_MAX}` };
  }
  if (!twoDecimals(price)) return { ok: false, message: "pricePerKgUsd allows at most 2 decimals" };

  return { ok: true, row: { origin, destination, price_per_kg_usd: price } };
}

/**
 * The website's From / To are POS countries (pos_list codes). Each maps to its
 * airports on the network, main airport first; prices stay per airport segment.
 * Keep in sync with the network (flychamadmin offers/constants/baggageSegments.js).
 */
export const POS_AIRPORTS: Record<string, string[]> = {
  sy: ["DAM", "ALP"],
  ae: ["DXB", "SHJ", "AUH"],
  kw: ["KWI"],
  iq: ["BGW", "EBL"],
  om: ["MCT"],
  tr: ["SAW"],
  ly: ["MJI"],
  am: ["EVN"],
};

/** An airport code stays itself; a POS code becomes its airports. */
export function airportsFor(code: string): string[] {
  const value = code.trim();
  if (IATA.test(value.toUpperCase())) return [value.toUpperCase()];
  return POS_AIRPORTS[value.toLowerCase()] ?? [];
}

/** Every origin × destination pair, main airports first (the preferred quote). */
export function candidateSegments(origins: string[], destinations: string[]) {
  return origins.flatMap((origin) =>
    destinations.filter((destination) => destination !== origin).map((destination) => ({ origin, destination })),
  );
}

type DbError = { code?: string; message: string };

/** Map a PostgREST error to the API's status codes. */
export function baggageDbFailure(error: DbError) {
  const msg = error.message ?? "Query failed";
  if (/jwt|invalid claim|unauthori[sz]ed/i.test(msg) || error.code === "PGRST301") {
    return publicError(msg, "unauthorized", 401);
  }
  if (error.code === "42501" || /row-level security|permission denied|policy/i.test(msg)) {
    return publicError(msg, "forbidden", 403);
  }
  if (isMissingTable(error)) {
    return publicError(
      "Baggage price table does not exist yet — run the create_baggage_segment_prices migration",
      "not_found",
      404,
    );
  }
  if (error.code === "23514") return publicError(msg, "invalid_price", 400);
  return publicError(msg, "query_failed", 500);
}
