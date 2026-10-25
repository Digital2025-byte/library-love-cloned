/**
 * Airports per POS (pos_list.airports) — shared by /api/public/pos-list (read +
 * save) and the baggage quote (POS code → its airports).
 *
 * Item shape: `{ code: "DAM", nameEn: "Damascus", nameAr: "دمشق" }`, main
 * airport first. Added by migration 20261025120000_add_pos_list_airports.
 */

export type PosAirport = { code: string; nameEn: string; nameAr: string };

export const POS_AIRPORTS_MAX = 20;
const IATA = /^[A-Z]{3}$/;

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Postgres has no `airports` column yet (the migration hasn't run). */
export function isMissingAirportsColumn(error: { code?: string; message?: string }) {
  return error.code === "42703" || /column .*airports.* does not exist/i.test(error.message ?? "");
}

/** Stored jsonb → clean list: drops malformed or repeated codes, keeps order. */
export function normalizeAirports(value: unknown): PosAirport[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const airports: PosAirport[] = [];
  for (const item of value) {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const code = str(row["code"]).toUpperCase();
    const nameEn = str(row["nameEn"]);
    if (!IATA.test(code) || !nameEn || seen.has(code)) continue;
    seen.add(code);
    airports.push({ code, nameEn, nameAr: str(row["nameAr"]) || nameEn });
  }
  return airports;
}

type ParsedAirports = { ok: true; airports: PosAirport[] } | { ok: false; message: string };

/** API input: `[{ code, nameEn, nameAr? }]` — validated strictly (no silent drops). */
export function parseAirportsInput(value: unknown): ParsedAirports {
  if (!Array.isArray(value)) return { ok: false, message: "airports must be an array" };
  if (value.length > POS_AIRPORTS_MAX) {
    return { ok: false, message: `A POS can have at most ${POS_AIRPORTS_MAX} airports` };
  }
  const seen = new Set<string>();
  const airports: PosAirport[] = [];
  for (const [index, item] of value.entries()) {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const code = str(row["code"]).toUpperCase();
    const nameEn = str(row["nameEn"]);
    const nameAr = str(row["nameAr"]) || nameEn;
    if (!IATA.test(code)) {
      return { ok: false, message: `airports[${index}].code must be a 3-letter airport code (e.g. DAM)` };
    }
    if (seen.has(code)) return { ok: false, message: `Airport ${code} is listed twice` };
    if (nameEn.length < 1 || nameEn.length > 80) {
      return { ok: false, message: `airports[${index}].nameEn must be 1–80 characters` };
    }
    if (nameAr.length > 80) {
      return { ok: false, message: `airports[${index}].nameAr must be at most 80 characters` };
    }
    seen.add(code);
    airports.push({ code, nameEn, nameAr });
  }
  return { ok: true, airports };
}
