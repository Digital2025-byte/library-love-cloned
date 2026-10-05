# CMS API reference

This document describes the CMS API as it exists today. The implementation files listed in [Source of truth](#source-of-truth) are the reference; this file is a reading guide, not a replacement.

There are two surfaces:

| Surface | Who uses it | Auth |
| --- | --- | --- |
| HTTP routes under `/api/public/*` | External clients, other apps, curl | Optional. Anonymous callers see published pages only. A Supabase user JWT in `Authorization` lets an admin see drafts. |
| TanStack Start server functions in `src/lib/cms.functions.ts` | This app (`/pages`, page builder) | Public reads. Writes require a signed-in admin. |

Both read the same Supabase tables (`pages`, `page_components`, `components`, `component_types`) under Row Level Security.

---

## Source of truth

Keep these files as the reference when the API changes:

| File | Role |
| --- | --- |
| [`src/routes/api/public/get-pages.ts`](../src/routes/api/public/get-pages.ts) | `GET /api/public/get-pages` and `createCmsClient()` |
| [`src/routes/api/public/get-page.ts`](../src/routes/api/public/get-page.ts) | `GET /api/public/get-page` |
| [`src/lib/cms.functions.ts`](../src/lib/cms.functions.ts) | In-app server functions: `getCmsPages`, `getCmsPage`, `createCmsComponent` |
| [`src/queries/pages.ts`](../src/queries/pages.ts) | React Query wrappers for page reads |
| [`src/queries/components.ts`](../src/queries/components.ts) | React Query mutation for creating a component |
| [`src/integrations/supabase/auth-middleware.ts`](../src/integrations/supabase/auth-middleware.ts) | Bearer JWT check used by writes |
| [`src/integrations/supabase/types.ts`](../src/integrations/supabase/types.ts) | Generated table types |
| [`supabase/migrations/`](../supabase/migrations/) | Schema, RLS, seed pages and component types |

---

## Environment

Server handlers use:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

The browser client uses the `VITE_` variants of the same names. Do not put secret/service-role keys in the public routes; they use the publishable key and rely on RLS.

---

## Shared HTTP conventions

Every public route returns JSON with:

```http
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, content-type, apikey
Cache-Control: no-store
```

`OPTIONS` is implemented on both routes (CORS preflight) and returns `{}`.

### Auth on public routes

`createCmsClient(request)` in `get-pages.ts`:

1. Always sends the publishable key as `apikey`.
2. If the caller sent `Authorization: Bearer <jwt>`, that header is forwarded to Supabase.
3. Otherwise the request is anonymous. RLS then only returns rows with `pages.status = 'published'`.

An admin session therefore sees drafts; everyone else does not.

### Error body

Failed public requests use:

```json
{
  "error": {
    "message": "human-readable message",
    "code": "machine_code"
  }
}
```

| HTTP | `code` | When |
| --- | --- | --- |
| 400 | `missing_slug` | `GET /api/public/get-page` without `slug` |
| 404 | `page_not_found` | No page for that slug (or RLS hid it) |
| 500 | `query_failed` | Supabase query error |

---

## `GET /api/public/get-pages`

Lists pages. Implementation: [`src/routes/api/public/get-pages.ts`](../src/routes/api/public/get-pages.ts).

### Query

| Param | Required | Description |
| --- | --- | --- |
| `status` | no | Filter to `draft` or `published`. Omit to return every row the caller is allowed to see. |

### Example

```http
GET /api/public/get-pages
GET /api/public/get-pages?status=published
```

```bash
curl -s "http://localhost:3000/api/public/get-pages?status=published"
```

Admin session (drafts included):

```bash
curl -s "http://localhost:3000/api/public/get-pages" \
  -H "Authorization: Bearer <supabase-access-token>"
```

### Success `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "help",
      "label": "Help",
      "description": "Help center landing page",
      "status": "published",
      "isPublished": true,
      "componentCount": 5,
      "createdAt": "2026-09-13T12:00:00.000Z",
      "updatedAt": "2026-09-13T12:00:00.000Z"
    }
  ],
  "meta": {
    "count": 6,
    "publishedCount": 6,
    "draftCount": 0,
    "filters": { "status": "published" },
    "generatedAt": "2026-09-14T07:00:00.000Z"
  }
}
```

`componentCount` is the number of `page_components` links on that page, not unique component types.

Pages are ordered by `slug` ascending.

Seeded slugs from the first migration: `help`, `contact-us`, `our-offices`, `our-gsa`, `forms`, `faqs`.

---

## `GET /api/public/get-page`

Returns one page and its ordered blocks. Implementation: [`src/routes/api/public/get-page.ts`](../src/routes/api/public/get-page.ts).

### Query

| Param | Required | Description |
| --- | --- | --- |
| `slug` | yes | Page slug, e.g. `help` |

### Example

```http
GET /api/public/get-page?slug=help
```

```bash
curl -s "http://localhost:3000/api/public/get-page?slug=help"
```

### Success `200`

```json
{
  "id": "uuid",
  "slug": "help",
  "label": "Help",
  "description": "Help center landing page",
  "status": "published",
  "isPublished": true,
  "createdAt": "2026-09-13T12:00:00.000Z",
  "updatedAt": "2026-09-13T12:00:00.000Z",
  "blocks": [
    {
      "uid": "component-uuid",
      "linkId": "page-component-uuid",
      "sectionId": "page-hero",
      "sectionLabel": "Page Hero",
      "position": 0,
      "order": 0,
      "languages": ["en", "ar"],
      "style": { "showImage": false },
      "content": {
        "en": { "title": "Help", "subtitle": "…" },
        "ar": { "title": "مساعدة", "subtitle": "…" }
      },
      "createdAt": "2026-09-13T12:00:00.000Z",
      "updatedAt": "2026-09-13T12:00:00.000Z"
    }
  ],
  "meta": {
    "blockCount": 5,
    "sectionIds": ["page-hero", "search-console", "help-categories"],
    "languages": ["en", "ar"],
    "generatedAt": "2026-09-14T07:00:00.000Z"
  }
}
```

### Block fields

| Field | Meaning |
| --- | --- |
| `uid` | `components.id` — the component instance |
| `linkId` | `page_components.id` — the page↔component join row |
| `sectionId` | `components.type`, matches `component_types.id` (e.g. `page-hero`) |
| `sectionLabel` | Human label from `component_types.label` |
| `position` | Order on this page (`page_components.position`) |
| `order` | Zero-based index after sorting by `position` |
| `languages` | Keys of the `content` object, typically `en` and `ar` |
| `style` | Shared (not per-language) JSON. `{}` if null |
| `content` | Per-language JSON map. `{}` if null |

Blocks with a missing nested `components` row are skipped.

A page that exists but is a draft returns **404** to anonymous callers (RLS `maybeSingle()` yields no row), not an empty document.

---

## In-app server functions

Used by the page list and page builder. Implementation: [`src/lib/cms.functions.ts`](../src/lib/cms.functions.ts).

These are TanStack Start `createServerFn` handlers, not REST paths. Call them from the app via React Query (`src/queries/pages.ts`, `src/queries/components.ts`), not as `/api/...` URLs.

### `getCmsPages()` — GET

Returns `CmsPageSummary[]`:

```ts
{
  slug: string
  label: string
  description: string | null
  status: string
  componentCount: number
}
```

Same RLS as the public list: published for everyone, drafts only if the request is an admin. Throws on query failure.

Consumed by `PagesList` through `pagesQueryOptions()`.

### `getCmsPage({ data: { slug } })` — GET

Returns `CmsPageDetail | null`:

```ts
{
  id: string
  slug: string
  label: string
  description: string | null
  status: string
  blocks: CmsBlock[]
}

{
  uid: string          // components.id
  sectionId: string    // components.type
  position: number
  style: object
  content: object
}
```

`slug` is required. Returns `null` when the page is missing or hidden by RLS.

This payload is thinner than `GET /api/public/get-page`: no `linkId`, `sectionLabel`, `order`, `languages`, timestamps, or `meta`.

### `createCmsComponent({ data })` — POST

Admin-only write. Middleware: `requireSupabaseAuth` (valid `Authorization: Bearer <jwt>`). RLS then requires `user_roles.role = 'admin'` for the insert.

Input:

```ts
{
  slug: string                 // required — page to attach to
  type: string                 // required — component_types.id
  position?: number            // omit to append after the last link
  style?: { [key: string]: Json }
  content?: { [key: string]: Json }
}
```

Behaviour:

1. Load `pages.id` for `slug`. Throws `Page not found: <slug>` if missing.
2. If `position` is omitted, use `max(page_components.position) + 1`, or `0` when the page is empty.
3. Insert a `components` row (`type`, `position`, `style`, `content`).
4. Insert a `page_components` link (`page_id`, `component_id`, `position`).
5. Return the new `CmsBlock`.

The page builder calls this from `PageBuilder` via `useCreateComponent()` when the user adds a block.

---

## Data model

```
pages 1 ──< page_components >── 1 components
                                    │
                                    └── type → component_types.id
```

A component can be linked to more than one page. Order is stored on the **link** (`page_components.position`), not as page ownership on the component.

### `pages`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `slug` | text | Unique URL key |
| `label` | text | Display name |
| `description` | text, nullable | |
| `status` | text | `draft` or `published` |
| `created_at` / `updated_at` | timestamptz | `updated_at` via trigger |

### `components`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK — exposed as `uid` |
| `type` | text | FK → `component_types.id` |
| `position` | integer | Legacy field; page order uses the link table |
| `style` | jsonb | Shared layout/variant flags |
| `content` | jsonb | `{ en: {...}, ar: {...} }` in the builder |

### `page_components`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK — exposed as `linkId` on the public page API |
| `page_id` | uuid | FK → `pages` |
| `component_id` | uuid | FK → `components` |
| `position` | integer | Render order on that page |
| Unique | `(page_id, component_id)` | One link per pair |

### `component_types` (seeded)

| `id` | `label` |
| --- | --- |
| `page-hero` | Page Hero |
| `search-console` | Search Console |
| `help-categories` | Help Categories |
| `cta-banner` | CTA Banner |
| `journey-section` | Journey Section |
| `live-chat-banner` | Live Chat Banner |
| `get-in-touch` | Get In Touch |
| `location-directory` | Location Directory |
| `faq-explorer` | FAQ Explorer |
| `forms-directory` | Forms Directory |
| `track-request` | Track Request |
| `contact-cards` | Contact Cards |
| `promo-banner` | Promo Banner |
| `office-directory` | Office Directory |

These ids are also the keys of `BLOCK_REGISTRY` in [`src/components/pageBuilder/registry/blockRegistry.js`](../src/components/pageBuilder/registry/blockRegistry.js).

### RLS (short)

- **anon / authenticated:** `SELECT` published pages, their links, and components that appear on at least one published page.
- **admin** (`user_roles.role = 'admin'`): read and write all pages, components, links, and component types.
- Roles: `admin`, `editor`. Writes in this API currently go through admin RLS, not a separate editor path.

Helpers: `is_admin()`, `page_is_published(_page_id)`, `component_is_public(_component_id)`, `has_role(_user_id, _role)`.

---

## Content and style shape

Structure and `style` are shared across languages. Copy lives under `content.<lang>`.

Typical block (builder + public API):

```json
{
  "uid": "…",
  "sectionId": "page-hero",
  "style": { "showImage": false },
  "content": {
    "en": { "title": "Contact Us", "subtitle": "…", "imageUrl": "/help/contact-us/ph1.png" },
    "ar": { "title": "تواصل معنا", "subtitle": "…", "imageUrl": "/help/contact-us/ph1.png" }
  }
}
```

Exact fields inside `content.en` / `content.ar` and `style` depend on `sectionId`. Use:

- Registry + default styles: [`src/components/pageBuilder/registry/blockRegistry.js`](../src/components/pageBuilder/registry/blockRegistry.js)
- Page-specific seeds: [`src/components/pageBuilder/presets/`](../src/components/pageBuilder/presets/)

---

## How this app consumes the API

```
GET /pages
  pagesQueryOptions() → getCmsPages() → PagesList

GET /pages/:slug
  PageBuilder (localStorage composition today)
  Add block → useCreateComponent() → createCmsComponent()
```

The public HTTP routes are the contract for **other** clients. The in-app list currently uses server functions, not `/api/public/*`.

---

## Quick checklist for consumers

1. Prefer `GET /api/public/get-pages?status=published` then `GET /api/public/get-page?slug=…` for a public site.
2. Render `blocks` in `position` / `order` sequence.
3. Pick `content[lang]` (fallback to `en` if a language is missing).
4. Map `sectionId` to a component in `BLOCK_REGISTRY` (or your own renderer).
5. Treat 404 on get-page as “no published page for this slug”.
6. Do not cache (`Cache-Control: no-store`); refetch when content changes.
7. For writes, use a real user JWT and an `admin` row in `user_roles` — the publishable key alone is not enough.

---

## Offers API

Managed from the flychamadmin **Offers** module (`flychamadmin/src/offers`). Source of truth:
[`src/lib/offers.ts`](../src/lib/offers.ts) (model + validator), [`src/lib/offers-http.ts`](../src/lib/offers-http.ts),
[`src/routes/api/public/offers/`](../src/routes/api/public/offers/), migration
[`20261004150000_create_offers.sql`](../supabase/migrations/20261004150000_create_offers.sql).

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/public/offers?type=&status=&search=` | optional | Anonymous: live offers only (`state = active`). Admin bearer: all. |
| POST | `/api/public/offers` | admin | Create → `201`. |
| GET | `/api/public/offers/:id` | optional | RLS hides non-active offers from anonymous callers. |
| PUT | `/api/public/offers/:id` | admin | Full replace of the editable fields. |
| DELETE | `/api/public/offers/:id` | admin | `{ data: { id } }`. |
| PATCH | `/api/public/offers/:id/status` | admin | `{ status: draft \| active \| inactive }`; `409 offer_expired` when activating an offer past its end date / passenger limit. |

**Offer** (request and response; `state`, `usedPassengers`, `remainingPassengers`, timestamps are read-only):

```json
{
  "code": "OW-DAM-IST",
  "title": { "en": "One-way to Istanbul", "ar": "ذهاب فقط إلى إسطنبول" },
  "description": { "en": "", "ar": "" },
  "type": "destination | trip | baggage | seat | payment",
  "tripType": "one_way | round_trip | multi_city (trip only, else null)",
  "details": { "…": "per type, see below" },
  "discount": { "type": "percentage | fixed", "value": 50, "currency": "USD (fixed only)" },
  "expiry": { "type": "time | passengers", "startsAt": "ISO", "endsAt": "ISO (time only)", "maxPassengers": 100 },
  "status": "draft | active | inactive",
  "state": "draft | active | scheduled | expired | inactive"
}
```

| `type` | `details` |
| --- | --- |
| destination | `{ origin: IATA \| null, destination: IATA, cabinClass: any\|economy\|business }` |
| trip | `{ cabinClass, segments: [{ origin, destination }] }` — 1 segment (one-way / round-trip, return = reverse) or 2–6 (multi-city) |
| baggage | `{ baggageType: checked\|cabin\|sports_equipment, weightKg: 1–100 }` |
| seat | `{ seatType: standard\|extra_legroom\|exit_row\|front_row\|preferred, cabinClass }` |
| payment | `{ paymentMethod: credit_card\|debit_card\|bank_transfer\|mobile_wallet\|cash, cardScheme: any\|visa\|mastercard\|amex (cards only), minSpend: number \| null }` |

Errors: `400 invalid_offer` with `issues: [{ path, message }]`, `409 duplicate_code`, `401`, `403`, `404 not_found`.
Passenger-based expiry is consumed by the booking flow through the service-role-only SQL function
`public.consume_offer_passengers(offer_id, passengers)` (atomic; raises when the offer is not live or would overflow).
