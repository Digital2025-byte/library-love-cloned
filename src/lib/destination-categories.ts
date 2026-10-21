/**
 * Shared destination categories (Sights Grid + Destination Things to Do).
 * Shape validated here and mirrored by destination_categories CHECKs.
 */

export const CATEGORY_ICONS = [
  "landmarks",
  "religion",
  "shopping",
  "activities",
  "nature",
  "museums",
  "mapPin",
  "camera",
  "mountains",
  "storefront",
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

export const CATEGORY_COLUMNS = "id, slug, label_en, label_ar, icon, position, updated_at";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type DestinationCategoryRow = {
  id: string;
  slug: string;
  label_en: string;
  label_ar: string;
  icon: string;
  position: number;
  updated_at: string;
};

export type DestinationCategory = {
  id: string;
  slug: string;
  labelEn: string;
  labelAr: string;
  icon: CategoryIcon;
  position: number;
  updatedAt: string;
};

export type CategoryIssue = { path: string; message: string };

export function isCategoryId(value: string) {
  return UUID.test(value);
}

export function categoryPayload(row: DestinationCategoryRow): DestinationCategory {
  return {
    id: row.id,
    slug: row.slug,
    labelEn: row.label_en,
    labelAr: row.label_ar,
    icon: row.icon as CategoryIcon,
    position: row.position,
    updatedAt: row.updated_at,
  };
}

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseCategoryInput(
  input: unknown,
): { ok: true; value: Omit<DestinationCategory, "id" | "updatedAt"> } | { ok: false; issues: CategoryIssue[] } {
  const issues: CategoryIssue[] = [];
  const body = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : null;
  if (!body) return { ok: false, issues: [{ path: "body", message: "Expected an object" }] };

  const slug = str(body["slug"]).toLowerCase();
  const labelEn = str(body["labelEn"]);
  const labelAr = str(body["labelAr"]);
  const icon = str(body["icon"]) || "landmarks";
  const position = body["position"];

  if (!SLUG.test(slug) || slug.length < 2 || slug.length > 40) {
    issues.push({ path: "slug", message: "Use 2–40 lowercase letters, numbers and single hyphens" });
  }
  if (labelEn.length < 1 || labelEn.length > 80) {
    issues.push({ path: "labelEn", message: "English label must be 1–80 characters" });
  }
  if (labelAr.length < 1 || labelAr.length > 80) {
    issues.push({ path: "labelAr", message: "Arabic label must be 1–80 characters" });
  }
  if (!(CATEGORY_ICONS as readonly string[]).includes(icon)) {
    issues.push({ path: "icon", message: "Choose one of the category icons" });
  }
  const positionNumber = typeof position === "number" ? position : Number(position);
  if (!Number.isInteger(positionNumber) || positionNumber < 0 || positionNumber > 999) {
    issues.push({ path: "position", message: "Position must be a whole number from 0 to 999" });
  }

  if (issues.length) return { ok: false, issues };
  return {
    ok: true,
    value: {
      slug,
      labelEn,
      labelAr,
      icon: icon as CategoryIcon,
      position: positionNumber,
    },
  };
}

export function categoryInsert(value: Omit<DestinationCategory, "id" | "updatedAt">) {
  return {
    slug: value.slug,
    label_en: value.labelEn,
    label_ar: value.labelAr,
    icon: value.icon,
    position: value.position,
    updated_at: new Date().toISOString(),
  };
}
