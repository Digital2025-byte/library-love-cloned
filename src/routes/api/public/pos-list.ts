import { createFileRoute } from "@tanstack/react-router";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicError, publicJson, requireBearer } from "@/lib/cms-public-http";
import {
  isMissingAirportsColumn,
  normalizeAirports,
  parseAirportsInput,
  type PosAirport,
} from "@/lib/pos-airports";
import { createCmsClient } from "./get-pages";

/**
 * GET  /api/public/pos-list — active POS (anon). With admin Bearer → every row.
 * POST /api/public/pos-list — create (admin)
 * PUT  /api/public/pos-list — update by `id` (admin); `airports` left out = unchanged
 * DELETE /api/public/pos-list?id= — delete (admin)
 *
 *   { data: [{ id?, code, nameEn, nameAr, flagUrl, currency, languages, position,
 *              airports: [{ code, nameEn, nameAr }], isActive? }] }
 */

const BASE_COLUMNS =
  "id, code, name_en, name_ar, flag_url, currency, languages, position, is_active, created_at, updated_at";
const COLUMNS = `${BASE_COLUMNS}, airports`;

type PosRow = {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  flag_url: string | null;
  currency: string;
  languages: string[] | null;
  position: number;
  is_active: boolean;
  airports?: unknown;
  created_at?: string;
  updated_at?: string;
};

type DbResult = { data: unknown; error: { code?: string; message: string } | null };

/**
 * Run a select with the airports column, and again without it while
 * migration 20261025120000 hasn't run (a failed statement writes nothing, so
 * retrying an insert / update is safe).
 */
async function withAirportsFallback(run: (columns: string) => PromiseLike<DbResult>) {
  const first = await run(COLUMNS);
  if (first.error && isMissingAirportsColumn(first.error)) return run(BASE_COLUMNS);
  return first;
}

const isMissingTable = (error: { code?: string; message?: string }) =>
  error.code === "42P01" ||
  error.code === "PGRST205" ||
  /relation .* does not exist|could not find the table/i.test(error.message ?? "");

function posPayload(row: PosRow, { includeAdmin = false } = {}) {
  const base = {
    code: row.code,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    flagUrl: row.flag_url ?? "",
    currency: row.currency,
    languages:
      Array.isArray(row.languages) && row.languages.length ? row.languages : ["en", "ar"],
    position: row.position,
    // Left out while the airports migration hasn't run, so clients use their defaults.
    ...("airports" in row ? { airports: normalizeAirports(row.airports) } : {}),
  };
  if (!includeAdmin) return base;
  return {
    ...base,
    id: row.id,
    isActive: row.is_active !== false,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

function dbFailure(error: { code?: string; message?: string }) {
  const msg = error.message ?? "Query failed";
  if (/jwt|invalid claim|unauthori[sz]ed/i.test(msg) || error.code === "PGRST301") {
    return publicError(msg, "unauthorized", 401);
  }
  if (error.code === "42501" || /row-level security|permission denied|policy/i.test(msg)) {
    return publicError(msg, "forbidden", 403);
  }
  if (isMissingTable(error)) {
    return publicError("POS list table does not exist yet", "not_found", 404);
  }
  if (isMissingAirportsColumn(error)) {
    return publicError(
      "Saving airports needs migration 20261025120000_add_pos_list_airports — run it in the Supabase SQL editor",
      "migration_required",
      409,
    );
  }
  if (error.code === "23505") {
    return publicError("Another POS already uses this code", "duplicate_code", 409);
  }
  if (error.code === "23514") {
    return publicError(msg, "invalid_pos", 400);
  }
  return publicError(msg, "query_failed", 500);
}

async function requireAdmin(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return dbFailure(error);
  if (data !== true) {
    return publicError("Admin role required", "forbidden", 403);
  }
  return null;
}

/** An airport belongs to one POS only (the quote maps POS → airports). */
async function airportConflict(
  supabase: SupabaseClient,
  airports: PosAirport[] | undefined,
  selfId?: string,
) {
  if (!airports?.length) return null;
  const { data, error } = await supabase.from("pos_list").select("id, code, airports");
  // A missing column fails the write itself, with the migration hint.
  if (error) return isMissingAirportsColumn(error) ? null : dbFailure(error);
  const mine = new Set(airports.map((airport) => airport.code));
  for (const row of (data ?? []) as { id: string; code: string; airports: unknown }[]) {
    if (row.id === selfId) continue;
    const clash = normalizeAirports(row.airports).find((airport) => mine.has(airport.code));
    if (clash) {
      return publicError(
        `Airport ${clash.code} already belongs to POS "${row.code}"`,
        "duplicate_airport",
        409,
      );
    }
  }
  return null;
}

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

type PosInput = {
  code?: unknown;
  nameEn?: unknown;
  nameAr?: unknown;
  flagUrl?: unknown;
  currency?: unknown;
  languages?: unknown;
  position?: unknown;
  isActive?: unknown;
  airports?: unknown;
};

function parsePosInput(body: unknown, { requireCode = true } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false as const, response: publicError("Request body must be a JSON object", "invalid_json", 400) };
  }
  const input = body as PosInput;
  const code = str(input.code).toLowerCase();
  const nameEn = str(input.nameEn);
  const nameAr = str(input.nameAr) || nameEn;
  const flagUrl = str(input.flagUrl);
  const currency = str(input.currency).toUpperCase();
  const languages = (Array.isArray(input.languages) ? input.languages : [])
    .map((l) => String(l))
    .filter((l) => l === "en" || l === "ar");
  const position = Number(input.position);
  const isActive = input.isActive !== false;

  if (requireCode && !/^[a-z]{2}$/.test(code)) {
    return {
      ok: false as const,
      response: publicError("code must be a 2-letter lowercase code (e.g. sy)", "invalid_pos", 400),
    };
  }
  if (!nameEn) {
    return { ok: false as const, response: publicError("nameEn is required", "invalid_pos", 400) };
  }
  if (!/^[A-Z]{3}$/.test(currency)) {
    return {
      ok: false as const,
      response: publicError("currency must be a 3-letter ISO code (e.g. SYP)", "invalid_pos", 400),
    };
  }
  // Optional: left out (older admin builds) keeps the stored airports.
  let airports: PosAirport[] | undefined;
  if (input.airports !== undefined) {
    const parsed = parseAirportsInput(input.airports);
    if (!parsed.ok) {
      return { ok: false as const, response: publicError(parsed.message, "invalid_pos", 400) };
    }
    airports = parsed.airports;
  }

  return {
    ok: true as const,
    airports,
    row: {
      ...(requireCode ? { code } : {}),
      name_en: nameEn,
      name_ar: nameAr,
      flag_url: flagUrl,
      currency,
      languages: languages.length ? languages : ["en", "ar"],
      position: Number.isFinite(position) ? position : 0,
      is_active: isActive,
      ...(airports ? { airports } : {}),
    },
  };
}

async function handleList(request: Request) {
  try {
    const supabase = createCmsClient(request);
    let admin = false;
    if (requireBearer(request)) {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      admin = isAdmin === true;
    }

    const { data, error } = await withAirportsFallback((columns) => {
      let query = supabase
        .from("pos_list")
        .select(columns)
        .order("position", { ascending: true })
        .order("code", { ascending: true });
      if (!admin) query = query.eq("is_active", true);
      return query;
    });
    if (error) return dbFailure(error);
    const rows = (data ?? []) as PosRow[];
    return publicJson(
      {
        data: rows.map((row) => posPayload(row, { includeAdmin: admin })),
        meta: { count: rows.length, generatedAt: new Date().toISOString() },
      },
      200,
      admin
        ? undefined
        : { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    );
  } catch (error) {
    return publicError(error instanceof Error ? error.message : "Query failed", "query_failed", 500);
  }
}

async function handleCreate(request: Request) {
  if (!requireBearer(request)) {
    return publicError(
      "Authorization: Bearer <supabase-access-token> is required",
      "unauthorized",
      401,
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return publicError("Request body must be JSON", "invalid_json", 400);
  }
  const parsed = parsePosInput(body, { requireCode: true });
  if (!parsed.ok) return parsed.response;

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireAdmin(supabase);
    if (forbidden) return forbidden;
    const conflict = await airportConflict(supabase, parsed.airports);
    if (conflict) return conflict;

    const { data, error } = await withAirportsFallback((columns) =>
      supabase.from("pos_list").insert(parsed.row).select(columns).single(),
    );
    if (error) return dbFailure(error);
    return publicJson(
      { data: posPayload(data as PosRow, { includeAdmin: true }), meta: { generatedAt: new Date().toISOString() } },
      201,
    );
  } catch (error) {
    return publicError(error instanceof Error ? error.message : "Create failed", "query_failed", 500);
  }
}

async function handleUpdate(request: Request) {
  if (!requireBearer(request)) {
    return publicError(
      "Authorization: Bearer <supabase-access-token> is required",
      "unauthorized",
      401,
    );
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return publicError("Request body must be JSON", "invalid_json", 400);
  }
  const id = str(body["id"]);
  if (!id) return publicError("Field `id` is required", "invalid_id", 400);

  const parsed = parsePosInput(body, { requireCode: true });
  if (!parsed.ok) return parsed.response;

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireAdmin(supabase);
    if (forbidden) return forbidden;
    const conflict = await airportConflict(supabase, parsed.airports, id);
    if (conflict) return conflict;

    const { data, error } = await withAirportsFallback((columns) =>
      supabase.from("pos_list").update(parsed.row).eq("id", id).select(columns).maybeSingle(),
    );
    if (error) return dbFailure(error);
    if (!data) return publicError(`POS not found: ${id}`, "not_found", 404);
    return publicJson({
      data: posPayload(data as PosRow, { includeAdmin: true }),
      meta: { generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : "Update failed", "query_failed", 500);
  }
}

async function handleDelete(request: Request) {
  if (!requireBearer(request)) {
    return publicError(
      "Authorization: Bearer <supabase-access-token> is required",
      "unauthorized",
      401,
    );
  }
  const id = new URL(request.url).searchParams.get("id")?.trim() || "";
  if (!id) return publicError("Query `id` is required", "invalid_id", 400);

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireAdmin(supabase);
    if (forbidden) return forbidden;

    const { data, error } = await supabase.from("pos_list").delete().eq("id", id).select("id");
    if (error) return dbFailure(error);
    if (!data?.length) return publicError(`POS not found: ${id}`, "not_found", 404);
    return publicJson({ data: { id }, meta: { generatedAt: new Date().toISOString() } });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : "Delete failed", "query_failed", 500);
  }
}

export const Route = createFileRoute("/api/public/pos-list")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: ({ request }) => handleList(request),
      POST: ({ request }) => handleCreate(request),
      PUT: ({ request }) => handleUpdate(request),
      DELETE: ({ request }) => handleDelete(request),
    },
  },
});
