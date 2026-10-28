/**
 * Currency conversion for the public API.
 *
 * Prices are stored in USD (`baggage_segment_prices.price_per_kg_usd`), but the
 * website shows them in the currency of the POS in the URL — `/kw/en/...` pays
 * in Kuwaiti dinar. The booking platform owns the rates, so we ask it:
 *
 *   POST https://flycham.com/api/booking/ExchangeCurrency/GetByCurrencies
 *   { "fromCurrency": "USD", "toCurrency": "KWD" }
 *   → { id, rate, updatesAt, fromCurrency, toCurrency }
 *
 * The call is made here rather than in the browser: that host sends no CORS
 * headers, so the public site cannot reach it directly.
 *
 * `/booking/ExchangeCurrency/*` is NOT anonymous — without credentials it
 * answers `403 {"isSuccess":false,...,"error":{"message":"Access denied"}}`.
 * Set `BOOKING_API_TOKEN` (a service account's bearer token) or
 * `BOOKING_API_BASIC_AUTH` ("user:password") in the CMS server's environment.
 * With neither, every quote stays in USD and says why via `rateError`.
 */

const DEFAULT_BOOKING_API_BASE = "https://flycham.com/api";

/**
 * Override for a staging booking platform. `VITE_` is accepted too so it can
 * be set in `.env` during local development (vite only exposes that prefix),
 * the same fallback `supabasePublicEnv` uses. Not a secret.
 */
const bookingApiBase = () =>
  (
    process.env["BOOKING_API_BASE_URL"] ||
    (import.meta.env["VITE_BOOKING_API_BASE_URL"] as string | undefined) ||
    DEFAULT_BOOKING_API_BASE
  ).replace(/\/+$/, "");

/**
 * Credentials for the booking platform, if the deployment was given any.
 * `process.env` ONLY — a `VITE_` variable would be inlined into the browser
 * bundle, and these must never leave the server.
 */
function authHeaders(): Record<string, string> {
  const token = process.env["BOOKING_API_TOKEN"]?.trim();
  if (token) return { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
  const basic = process.env["BOOKING_API_BASIC_AUTH"]?.trim();
  if (basic) return { Authorization: `Basic ${Buffer.from(basic).toString("base64")}` };
  return {};
}

const EXCHANGE_PATH = "/booking/ExchangeCurrency/GetByCurrencies";
const REQUEST_TIMEOUT_MS = 8000;
/** Rates move slowly (the response carries an hourly `updatesAt`). */
const CACHE_TTL_MS = 5 * 60 * 1000;

export type ExchangeRate = {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  /** When the booking platform last refreshed it, as returned. */
  updatedAt: string | null;
};

/** Why no rate came back, for the caller to pass on. */
export type ExchangeFailure =
  | "invalid_currency"
  | "unauthorized"
  | "unavailable"
  | "no_rate";

export type ExchangeResult =
  | { ok: true; rate: ExchangeRate }
  | { ok: false; reason: ExchangeFailure };

type CacheEntry = { value: ExchangeRate; expiresAt: number };
const cache = new Map<string, CacheEntry>();

const isCurrency = (value: unknown) => /^[A-Za-z]{3}$/.test(String(value ?? "").trim());

/**
 * The payload is flat on success (`{ id, rate, updatesAt, … }`) but wrapped on
 * failure (`{ isSuccess, result, error }`), so read the rate from either.
 */
function readRate(body: unknown): { rate: number; updatedAt: string | null } | null {
  const envelope = body as { result?: unknown; isSuccess?: unknown } | null;
  const source = (
    envelope && typeof envelope === "object" && envelope.result
      ? envelope.result
      : body
  ) as { rate?: unknown; updatesAt?: unknown } | null;

  const rate = Number(source?.rate);
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return {
    rate,
    updatedAt: typeof source?.updatesAt === "string" ? source.updatesAt : null,
  };
}

/**
 * The rate from one currency to another. Identical currencies resolve to 1
 * without a request. Never throws: a failure comes back as `{ ok: false }` with
 * a reason, so the caller can answer in the original currency and say why.
 */
export async function getExchangeRate(from: string, to: string): Promise<ExchangeResult> {
  if (!isCurrency(from) || !isCurrency(to)) return { ok: false, reason: "invalid_currency" };
  const fromCurrency = String(from).trim().toUpperCase();
  const toCurrency = String(to).trim().toUpperCase();
  if (fromCurrency === toCurrency) {
    return { ok: true, rate: { fromCurrency, toCurrency, rate: 1, updatedAt: null } };
  }

  const key = `${fromCurrency}>${toCurrency}`;
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return { ok: true, rate: hit.value };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${bookingApiBase()}${EXCHANGE_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ fromCurrency, toCurrency }),
      signal: controller.signal,
    });

    if (response.status === 401 || response.status === 403) {
      console.warn(
        `[currency-exchange] ${fromCurrency}->${toCurrency}: ${response.status} from the booking API. ` +
          "Set BOOKING_API_TOKEN (or BOOKING_API_BASIC_AUTH) so prices can be converted.",
      );
      return { ok: false, reason: "unauthorized" };
    }
    if (!response.ok) {
      console.warn(`[currency-exchange] ${fromCurrency}->${toCurrency}: HTTP ${response.status}`);
      return { ok: false, reason: "unavailable" };
    }

    const parsed = readRate(await response.json());
    if (!parsed) {
      console.warn(`[currency-exchange] ${fromCurrency}->${toCurrency}: no usable rate in the response`);
      return { ok: false, reason: "no_rate" };
    }

    const value: ExchangeRate = { fromCurrency, toCurrency, ...parsed };
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return { ok: true, rate: value };
  } catch (error) {
    // Offline, timed out, or a non-JSON answer — the caller stays in USD.
    console.warn(
      `[currency-exchange] ${fromCurrency}->${toCurrency} failed:`,
      error instanceof Error ? error.message : error,
    );
    return { ok: false, reason: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}

/** Convert an amount, rounded to the minor unit (2 decimals). */
export const convertAmount = (amount: number, rate: number) =>
  Math.round(amount * rate * 100) / 100;
