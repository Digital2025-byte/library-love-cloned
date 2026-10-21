import { createFileRoute } from "@tanstack/react-router";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicError, publicJson } from "@/lib/cms-public-http";
import {
  BAGGAGE_PRICE_COLUMNS,
  BAGGAGE_PRICE_TABLE,
  baggageDbFailure,
  baggagePricePayload,
  parseBaggagePriceInput,
  type BaggagePriceRow,
} from "@/lib/baggage-prices";
import { missingBearer, okJson, readJsonBody, serverFailure } from "@/lib/offers-http";
import { createCmsClient } from "../get-pages";

/**
 * GET /api/public/baggage-prices
 *   Every saved segment price: `[{ key, origin, destination, pricePerKgUsd, updatedAt }]`.
 * PUT /api/public/baggage-prices   { origin, destination, pricePerKgUsd }   (admin)
 *   Create or replace one directed segment's USD price per 1 kg; returns it.
 */
async function handleList(request: Request) {
  try {
    const { data, error } = await createCmsClient(request)
      .from(BAGGAGE_PRICE_TABLE)
      .select(BAGGAGE_PRICE_COLUMNS)
      .order("origin", { ascending: true })
      .order("destination", { ascending: true });
    if (error) return baggageDbFailure(error);
    return okJson(((data ?? []) as unknown as BaggagePriceRow[]).map(baggagePricePayload));
  } catch (error) {
    return serverFailure(error, "Query failed");
  }
}

/** RLS turns a non-admin write into a silent 0-row result, so check the role first. */
async function requireBaggageAdmin(supabase: SupabaseClient): Promise<Response | null> {
  const admin = await supabase.rpc("is_admin");
  if (admin.error) return baggageDbFailure(admin.error);
  if (admin.data !== true) {
    return publicError("Only CMS admins can set baggage prices", "forbidden", 403);
  }
  return null;
}

async function handleSave(request: Request) {
  const unauthorized = missingBearer(request);
  if (unauthorized) return unauthorized;

  const read = await readJsonBody(request);
  if (!read.ok) return read.response;
  const parsed = parseBaggagePriceInput(read.body);
  if (!parsed.ok) return publicError(parsed.message, "invalid_price", 400);

  try {
    const supabase = createCmsClient(request);
    const forbidden = await requireBaggageAdmin(supabase);
    if (forbidden) return forbidden;

    const { data, error } = await supabase
      .from(BAGGAGE_PRICE_TABLE)
      .upsert(
        { ...parsed.row, updated_at: new Date().toISOString() },
        { onConflict: "origin,destination" },
      )
      .select(BAGGAGE_PRICE_COLUMNS)
      .single();
    if (error) return baggageDbFailure(error);
    return okJson(baggagePricePayload(data as unknown as BaggagePriceRow));
  } catch (error) {
    return serverFailure(error, "Save failed");
  }
}

export const Route = createFileRoute("/api/public/baggage-prices/")({
  server: {
    handlers: {
      OPTIONS: () => publicJson({}),
      GET: ({ request }) => handleList(request),
      PUT: ({ request }) => handleSave(request),
    },
  },
});
