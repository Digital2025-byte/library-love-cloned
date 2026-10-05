/**
 * Offers — domain model, validation and row ↔ API mapping.
 *
 * Table: public.offers (migration 20261004150000_create_offers.sql). The table
 * CHECKs enforce the cross-field rules too; this module validates first so the
 * admin gets one readable `{ path, message }` per problem instead of a raw
 * constraint error. Keep it in sync with flychamadmin/src/offers/schemas.
 *
 * API shape (camelCase, nested):
 *   {
 *     id, code, title: {en, ar}, description: {en, ar},
 *     type, tripType, details,
 *     discount: { type, value, currency },
 *     expiry:   { type, startsAt, endsAt, maxPassengers, usedPassengers, remainingPassengers },
 *     status, state, createdAt, updatedAt
 *   }
 */

export const OFFER_TYPES = ["destination", "trip", "baggage", "seat", "payment"] as const;
export const TRIP_TYPES = ["one_way", "round_trip", "multi_city"] as const;
export const OFFER_STATUSES = ["draft", "active", "inactive"] as const;
export const DISCOUNT_TYPES = ["percentage", "fixed"] as const;
export const EXPIRY_TYPES = ["time", "passengers"] as const;
export const CABIN_CLASSES = ["any", "economy", "business"] as const;
export const BAGGAGE_TYPES = ["checked", "cabin", "sports_equipment"] as const;
export const SEAT_TYPES = ["standard", "extra_legroom", "exit_row", "front_row", "preferred"] as const;
export const PAYMENT_METHODS = [
  "credit_card",
  "debit_card",
  "bank_transfer",
  "mobile_wallet",
  "cash",
] as const;
export const CARD_SCHEMES = ["any", "visa", "mastercard", "amex"] as const;

export const OFFER_LIMITS = {
  titleMax: 120,
  descriptionMax: 1000,
  multiCitySegments: { min: 2, max: 6 },
  baggageWeightKg: { min: 1, max: 100 },
  maxPassengers: 100_000,
  fixedDiscountMax: 100_000,
} as const;

export type OfferType = (typeof OFFER_TYPES)[number];
export type TripType = (typeof TRIP_TYPES)[number];
export type OfferStatus = (typeof OFFER_STATUSES)[number];
export type DiscountType = (typeof DISCOUNT_TYPES)[number];
export type ExpiryType = (typeof EXPIRY_TYPES)[number];
/** Admin status + what the dates / usage say right now. */
export type OfferState = OfferStatus | "scheduled" | "expired";

export type OfferIssue = { path: string; message: string };

export const OFFER_COLUMNS =
  "id, code, title_en, title_ar, description_en, description_ar, type, trip_type, details, " +
  "discount_type, discount_value, currency, expiry_type, starts_at, ends_at, " +
  "max_passengers, used_passengers, status, created_at, updated_at";

export type OfferRow = {
  id: string;
  code: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  type: OfferType;
  trip_type: TripType | null;
  details: Record<string, unknown>;
  discount_type: DiscountType;
  discount_value: number | string; // numeric comes back as a string
  currency: string | null;
  expiry_type: ExpiryType;
  starts_at: string;
  ends_at: string | null;
  max_passengers: number | null;
  used_passengers: number;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
};

/** Writable columns produced by `parseOfferInput`. */
export type OfferWrite = Omit<OfferRow, "id" | "used_passengers" | "created_at" | "updated_at">;

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

export function offerState(row: OfferRow, now = Date.now()): OfferState {
  if (row.status !== "active") return row.status;
  if (now < Date.parse(row.starts_at)) return "scheduled";
  if (row.expiry_type === "time" && row.ends_at && now >= Date.parse(row.ends_at)) {
    return "expired";
  }
  if (
    row.expiry_type === "passengers" &&
    row.max_passengers !== null &&
    row.used_passengers >= row.max_passengers
  ) {
    return "expired";
  }
  return "active";
}

/** True when the dates / usage alone already end the offer (status aside). */
export function isPastExpiry(row: OfferRow, now = Date.now()): boolean {
  return offerState({ ...row, status: "active", starts_at: new Date(0).toISOString() }, now) ===
    "expired";
}

export function offerPayload(row: OfferRow) {
  const remaining =
    row.max_passengers === null ? null : Math.max(row.max_passengers - row.used_passengers, 0);
  return {
    id: row.id,
    code: row.code,
    title: { en: row.title_en, ar: row.title_ar },
    description: { en: row.description_en ?? "", ar: row.description_ar ?? "" },
    type: row.type,
    tripType: row.trip_type,
    details: row.details ?? {},
    discount: {
      type: row.discount_type,
      value: Number(row.discount_value),
      currency: row.currency,
    },
    expiry: {
      type: row.expiry_type,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      maxPassengers: row.max_passengers,
      usedPassengers: row.used_passengers,
      remainingPassengers: remaining,
    },
    status: row.status,
    state: offerState(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type OfferPayload = ReturnType<typeof offerPayload>;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type Obj = Record<string, unknown>;

const IATA = /^[A-Z]{3}$/;
const OFFER_CODE = /^[A-Z0-9][A-Z0-9-]{2,31}$/;
const CURRENCY = /^[A-Z]{3}$/;
const ARABIC = /[؀-ۿ]/;

function isObj(value: unknown): value is Obj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function oneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

/** Collects issues while reading an untrusted object. */
class Checker {
  issues: OfferIssue[] = [];

  add(path: string, message: string) {
    if (this.issues.length < 100) this.issues.push({ path, message });
  }

  text(o: Obj, key: string, path: string, opts: { min?: number; max: number; optional?: boolean }) {
    const raw = o[key];
    if (raw === undefined || raw === null || raw === "") {
      if (!opts.optional) this.add(path, "is required");
      return null;
    }
    if (typeof raw !== "string") {
      this.add(path, "must be a string");
      return null;
    }
    const value = raw.trim();
    if (opts.min !== undefined && value.length < opts.min) {
      this.add(path, `must be at least ${opts.min} characters`);
    }
    if (value.length > opts.max) this.add(path, `must be at most ${opts.max} characters`);
    return value === "" ? null : value;
  }

  enumOf<T extends string>(o: Obj, key: string, path: string, list: readonly T[]): T | null {
    const value = o[key];
    if (!oneOf(list, value)) {
      this.add(path, `must be one of: ${list.join(", ")}`);
      return null;
    }
    return value;
  }

  number(o: Obj, key: string, path: string, opts: { min: number; max: number; int?: boolean }) {
    const value = o[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      this.add(path, "must be a number");
      return null;
    }
    if (opts.int && !Number.isInteger(value)) this.add(path, "must be a whole number");
    if (value < opts.min || value > opts.max) {
      this.add(path, `must be between ${opts.min} and ${opts.max}`);
    }
    return value;
  }

  date(o: Obj, key: string, path: string) {
    const value = o[key];
    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
      this.add(path, "must be an ISO date-time");
      return null;
    }
    return new Date(value).toISOString();
  }

  iata(o: Obj, key: string, path: string, optional = false) {
    const value = o[key];
    if ((value === undefined || value === null || value === "") && optional) return null;
    if (typeof value !== "string" || !IATA.test(value)) {
      this.add(path, "must be a 3-letter IATA airport code (e.g. DAM)");
      return null;
    }
    return value;
  }

  obj(o: Obj, key: string, path: string): Obj | null {
    const value = o[key];
    if (!isObj(value)) {
      this.add(path, "must be an object");
      return null;
    }
    return value;
  }
}

/** Validate `details` for the given type; returns the cleaned object. */
function parseDetails(c: Checker, type: OfferType, tripType: TripType | null, d: Obj): Obj {
  switch (type) {
    case "destination": {
      const origin = c.iata(d, "origin", "details.origin", true);
      const destination = c.iata(d, "destination", "details.destination");
      if (origin && origin === destination) {
        c.add("details.destination", "must differ from the origin");
      }
      return {
        origin,
        destination,
        cabinClass: c.enumOf(d, "cabinClass", "details.cabinClass", CABIN_CLASSES),
      };
    }

    case "trip": {
      const raw = d["segments"];
      const segments: Obj[] = [];
      if (!Array.isArray(raw)) {
        c.add("details.segments", "must be a list of flight segments");
      } else {
        const { min, max } = OFFER_LIMITS.multiCitySegments;
        if (tripType === "multi_city" && (raw.length < min || raw.length > max)) {
          c.add("details.segments", `a multi-city trip needs ${min}–${max} segments`);
        }
        if (tripType !== "multi_city" && raw.length !== 1) {
          c.add("details.segments", "one-way and round trips have exactly one route");
        }
        raw.slice(0, max).forEach((seg, i) => {
          const path = `details.segments[${i}]`;
          if (!isObj(seg)) {
            c.add(path, "must be an object");
            return;
          }
          const origin = c.iata(seg, "origin", `${path}.origin`);
          const destination = c.iata(seg, "destination", `${path}.destination`);
          if (origin && origin === destination) {
            c.add(`${path}.destination`, "must differ from the origin");
          }
          segments.push({ origin, destination });
        });
      }
      return {
        cabinClass: c.enumOf(d, "cabinClass", "details.cabinClass", CABIN_CLASSES),
        segments,
      };
    }

    case "baggage": {
      const { min, max } = OFFER_LIMITS.baggageWeightKg;
      return {
        baggageType: c.enumOf(d, "baggageType", "details.baggageType", BAGGAGE_TYPES),
        weightKg: c.number(d, "weightKg", "details.weightKg", { min, max, int: true }),
      };
    }

    case "seat":
      return {
        seatType: c.enumOf(d, "seatType", "details.seatType", SEAT_TYPES),
        cabinClass: c.enumOf(d, "cabinClass", "details.cabinClass", CABIN_CLASSES),
      };

    case "payment": {
      const paymentMethod = c.enumOf(d, "paymentMethod", "details.paymentMethod", PAYMENT_METHODS);
      const isCard = paymentMethod === "credit_card" || paymentMethod === "debit_card";
      const cardScheme = isCard
        ? c.enumOf(d, "cardScheme", "details.cardScheme", CARD_SCHEMES)
        : null;
      const minSpend =
        d["minSpend"] === undefined || d["minSpend"] === null
          ? null
          : c.number(d, "minSpend", "details.minSpend", { min: 0, max: 1_000_000 });
      return { paymentMethod, cardScheme, minSpend };
    }
  }
}

export type ParsedOffer = { ok: true; offer: OfferWrite } | { ok: false; issues: OfferIssue[] };

/**
 * Validate a create / update request body (full document — PUT replaces the
 * offer). `status` is optional and defaults to "draft".
 */
export function parseOfferInput(body: unknown): ParsedOffer {
  const c = new Checker();
  if (!isObj(body)) return { ok: false, issues: [{ path: "", message: "must be an object" }] };

  const rawCode = typeof body["code"] === "string" ? body["code"].trim().toUpperCase() : "";
  if (!OFFER_CODE.test(rawCode)) {
    c.add("code", "must be 3–32 characters: A–Z, 0–9 and dashes, starting with a letter or digit");
  }

  const title = c.obj(body, "title", "title") ?? {};
  const titleEn = c.text(title, "en", "title.en", { min: 2, max: OFFER_LIMITS.titleMax });
  const titleAr = c.text(title, "ar", "title.ar", { min: 2, max: OFFER_LIMITS.titleMax });
  if (titleAr && !ARABIC.test(titleAr)) c.add("title.ar", "must contain Arabic text");

  const description = isObj(body["description"]) ? body["description"] : {};
  const descriptionOpts = { max: OFFER_LIMITS.descriptionMax, optional: true };
  const descriptionEn = c.text(description, "en", "description.en", descriptionOpts);
  const descriptionAr = c.text(description, "ar", "description.ar", descriptionOpts);

  const type = c.enumOf(body, "type", "type", OFFER_TYPES);
  let tripType: TripType | null = null;
  if (type === "trip") tripType = c.enumOf(body, "tripType", "tripType", TRIP_TYPES);
  else if (body["tripType"] !== undefined && body["tripType"] !== null) {
    c.add("tripType", "is only allowed for trip offers");
  }
  const rawDetails = c.obj(body, "details", "details");
  const details = type && rawDetails ? parseDetails(c, type, tripType, rawDetails) : {};

  // discount
  const discount = c.obj(body, "discount", "discount") ?? {};
  const discountType = c.enumOf(discount, "type", "discount.type", DISCOUNT_TYPES);
  const discountValue = c.number(discount, "value", "discount.value", {
    min: 0.01,
    max: discountType === "percentage" ? 100 : OFFER_LIMITS.fixedDiscountMax,
  });
  let currency: string | null = null;
  if (discountType === "fixed") {
    const raw = discount["currency"];
    if (typeof raw !== "string" || !CURRENCY.test(raw)) {
      c.add("discount.currency", "must be a 3-letter ISO currency (e.g. USD)");
    } else currency = raw;
  }

  // expiry
  const expiry = c.obj(body, "expiry", "expiry") ?? {};
  const expiryType = c.enumOf(expiry, "type", "expiry.type", EXPIRY_TYPES);
  const startsAt = c.date(expiry, "startsAt", "expiry.startsAt");
  let endsAt: string | null = null;
  let maxPassengers: number | null = null;
  if (expiryType === "time") {
    endsAt = c.date(expiry, "endsAt", "expiry.endsAt");
    if (startsAt && endsAt && Date.parse(endsAt) <= Date.parse(startsAt)) {
      c.add("expiry.endsAt", "must be after the start date");
    }
  } else if (expiryType === "passengers") {
    maxPassengers = c.number(expiry, "maxPassengers", "expiry.maxPassengers", {
      min: 1,
      max: OFFER_LIMITS.maxPassengers,
      int: true,
    });
  }

  let status: OfferStatus = "draft";
  if (body["status"] !== undefined) {
    status = c.enumOf(body, "status", "status", OFFER_STATUSES) ?? "draft";
  }

  if (c.issues.length > 0 || !type || !discountType || !expiryType || !startsAt) {
    return { ok: false, issues: c.issues };
  }

  return {
    ok: true,
    offer: {
      code: rawCode,
      title_en: titleEn ?? "",
      title_ar: titleAr ?? "",
      description_en: descriptionEn,
      description_ar: descriptionAr,
      type,
      trip_type: tripType,
      details,
      discount_type: discountType,
      discount_value: discountValue ?? 0,
      currency,
      expiry_type: expiryType,
      starts_at: startsAt,
      ends_at: endsAt,
      max_passengers: maxPassengers,
      status,
    },
  };
}

export function parseOfferStatus(body: unknown): OfferStatus | null {
  return isObj(body) && oneOf(OFFER_STATUSES, body["status"]) ? body["status"] : null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isOfferId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}
