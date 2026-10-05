/**
 * Offers — HTTP helpers shared by the /api/public/offers* routes.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicError, publicJson, requireBearer } from "@/lib/cms-public-http";
import { isMissingTable } from "@/lib/site-header";
import type { OfferIssue } from "@/lib/offers";

type DbError = { code?: string; message: string };

const meta = () => ({ generatedAt: new Date().toISOString() });

export function okJson(data: unknown, status = 200) {
  return publicJson({ data, meta: meta() }, status);
}

export function invalidOffer(issues: OfferIssue[]) {
  return publicJson(
    {
      error: {
        code: "invalid_offer",
        message: `Offer is invalid (${issues.length} issue${issues.length === 1 ? "" : "s"})`,
        issues,
      },
    },
    400,
  );
}

export function offerNotFound(id: string) {
  return publicError(`Offer not found: ${id}`, "not_found", 404);
}

/** Map a PostgREST error to the API's status codes. */
export function offerDbFailure(error: DbError) {
  const msg = error.message ?? "Query failed";
  if (/jwt|invalid claim|unauthori[sz]ed/i.test(msg) || error.code === "PGRST301") {
    return publicError(msg, "unauthorized", 401);
  }
  if (error.code === "42501" || /row-level security|permission denied|policy/i.test(msg)) {
    return publicError(msg, "forbidden", 403);
  }
  if (isMissingTable(error)) {
    return publicError(
      "Offers table does not exist yet — run the create_offers migration",
      "not_found",
      404,
    );
  }
  if (error.code === "23505") {
    return publicJson(
      {
        error: {
          code: "duplicate_code",
          message: "Another offer already uses this code",
          issues: [{ path: "code", message: "is already used by another offer" }],
        },
      },
      409,
    );
  }
  if (error.code === "23514") {
    // Table CHECK the validator could not see (usage depends on the stored row).
    if (/offers_usage_within_limit/.test(msg)) {
      return invalidOffer([
        {
          path: "expiry.maxPassengers",
          message: "can't be lower than the passengers who already used the offer",
        },
      ]);
    }
    return publicError(msg, "invalid_offer", 400);
  }
  return publicError(msg, "query_failed", 500);
}

export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false, response: publicError("Request body must be JSON", "invalid_json", 400) };
  }
}

/** Writes need a bearer token… */
export function missingBearer(request: Request) {
  return requireBearer(request)
    ? null
    : publicError("Authorization: Bearer <supabase-access-token> is required", "unauthorized", 401);
}

/**
 * …and an admin role. RLS would turn a non-admin write into a silent 0-row
 * result (indistinguishable from "not found"), so check the role first.
 */
export async function requireOfferAdmin(supabase: SupabaseClient): Promise<Response | null> {
  const admin = await supabase.rpc("is_admin");
  if (admin.error) return offerDbFailure(admin.error);
  if (admin.data !== true) {
    return publicError("Only CMS admins can manage offers", "forbidden", 403);
  }
  return null;
}

export function serverFailure(error: unknown, fallback: string) {
  return publicError(error instanceof Error ? error.message : fallback, "query_failed", 500);
}
