# Fly Cham CMS API — Documentation

REST API of the Fly Cham CMS backend (`cms/` — TanStack Start server, data in Supabase).
It powers the public website (`new_fly_cham`) and the CMS editor in the admin (`flychamadmin` → cms2).

Companion file: **`FlyCham-CMS-API.postman_collection.json`** (import it into Postman — every endpoint below is a ready request there).

---

## Contents

1. [Quick start (Postman)](#1-quick-start-postman)
2. [Base URLs](#2-base-urls)
3. [Authentication](#3-authentication)
4. [Conventions (headers, errors, caching)](#4-conventions)
5. [How content is modelled (pages, blocks, languages)](#5-how-content-is-modelled)
6. [Endpoint summary](#6-endpoint-summary)
7. [Pages](#7-pages)
8. [Page components (blocks)](#8-page-components-blocks)
9. [Site header](#9-site-header)
10. [Site footer](#10-site-footer)
11. [Offers](#11-offers)
12. [Error codes reference](#12-error-codes-reference)
13. [Component types (`sectionId`) in use](#13-component-types-sectionid-in-use)
14. [Known issues](#14-known-issues)

---

## 1. Quick start (Postman)

1. Postman → **Import** → choose `FlyCham-CMS-API.postman_collection.json`.
2. Open the collection → **Variables** tab and fill:
   | Variable | Value |
   |---|---|
   | `supabaseKey` | Supabase publishable (anon) key — `SUPABASE_PUBLISHABLE_KEY` in `cms/.env` |
   | `adminEmail` / `adminPassword` | A CMS admin account |
   | `baseUrl` | Already set to live. Use `http://localhost:3000` for local dev |
3. Read requests (`get-pages`, `get-page`, `get-header`, `get-footer`) work immediately — no token.
4. For writes run **0. Auth → Sign in** once. Its script saves `accessToken`; all write requests already send `Authorization: Bearer {{accessToken}}`. The token lasts ~1 hour — run **Refresh token** when you get `401`.
5. Scripts also save handy ids for you: `uid` (from *Get page* / *Create component*), `offerId` (from *List offers* / *Create offer*), `headerVersion`+`headerDocument`, `footerVersion`+`footerDocument`.

> ⚠️ **Writes hit the LIVE database.** The collection's default `slug` is `test-page`, a page that is safe to edit. Change it only when you mean to edit a real page.

---

## 2. Base URLs

| Environment | Base URL |
|---|---|
| Live (VPS) | `https://cms-api.cms-flycham.alpatrose.com` |
| Local dev (`npm run dev` in `cms/`) | `http://localhost:3000` |

All endpoints live under **`/api/public/`**.
("public" means *reachable over HTTP from other apps* — write endpoints still require an admin token.)

---

## 3. Authentication

| Operation | Auth |
|---|---|
| All `GET` reads | None. Optional admin bearer → also returns drafts / draft languages |
| All writes (`POST` / `PUT` / `PATCH` / `DELETE`) | `Authorization: Bearer <Supabase access token>` of a user with the **admin** role |

**How it works.** The backend forwards your bearer token to Supabase. Row-Level Security (RLS) and the database function `public.is_admin()` decide what you can read and write. So a missing token → `401 unauthorized`, a valid token of a non-admin user → `403 forbidden`.

### Getting a token (Supabase Auth)

```http
POST https://xbqrfakpcisqunyugrqt.supabase.co/auth/v1/token?grant_type=password
apikey: <SUPABASE_PUBLISHABLE_KEY>
Content-Type: application/json

{ "email": "<admin email>", "password": "<admin password>" }
```

Response (trimmed): `{ "access_token": "eyJ…", "refresh_token": "…", "expires_in": 3600, "user": {…} }`

Refresh before it expires:

```http
POST https://xbqrfakpcisqunyugrqt.supabase.co/auth/v1/token?grant_type=refresh_token
apikey: <SUPABASE_PUBLISHABLE_KEY>

{ "refresh_token": "<refresh_token>" }
```

Check the role: `POST {supabaseUrl}/rest/v1/rpc/is_admin` with the bearer → `true` for admins.

---

## 4. Conventions

**Request**
- JSON bodies: `Content-Type: application/json`. A body that is not valid JSON → `400 invalid_json`.
- Languages: `en` (default) and `ar`. Arabic responses carry `meta.dir = "rtl"`.

**Response**
- Success bodies are JSON; most wrap the result as `{ "data": …, "meta": { "generatedAt": "…" } }` (`get-page` returns the page object at top level).
- **CORS** is open: `Access-Control-Allow-Origin: *`, allowed headers `authorization, content-type, apikey`. Every route answers `OPTIONS` preflight.
- **Caching:** `Cache-Control: no-store` everywhere **except** `get-header` (`public, max-age=60, stale-while-revalidate=300` — header edits can take up to 1 minute to show).

**Errors** — always the same shape:

```json
{ "error": { "message": "Human readable text", "code": "machine_code" } }
```

Validation errors add `issues`, one per problem:

```json
{
  "error": {
    "code": "invalid_offer",
    "message": "Offer is invalid (2 issues)",
    "issues": [
      { "path": "title.ar", "message": "must contain Arabic text" },
      { "path": "details.destination", "message": "must differ from the origin" }
    ]
  }
}
```

Full list: [§12 Error codes](#12-error-codes-reference).

---

## 5. How content is modelled

```
pages 1 ──< page_components >── 1 components ── type → component_types
            (page_id, component_id,                (id, type, style, content)
             lang, position)
```

| Concept | Meaning |
|---|---|
| **Page** | `slug` (URL key, e.g. `allowed-baggage`), `label`, `description`, `status` (`draft` \| `published`). |
| **Component / block** | One section on a page. `uid` = component id. `sectionId` = its **type** (e.g. `cta-banner`) — the website picks the React block by this. |
| **Link** (`linkId`) | Puts a component on a page **in one language** at a `position`. |
| **Per-language blocks** | A page's English and Arabic block lists are independent. Creating/deleting a block in `en` doesn't touch `ar`. |
| **`content`** | Per-language map: `{ "en": {…}, "ar": {…} }`. Fields inside depend on the `sectionId`. |
| **`style`** | Per-language map `{ "en": {…}, "ar": {…} }` (old blocks may still have one flat object shared by both languages). Colours are theme tokens (`"50"`, `"700"`, `"primary-1"`, `"secondary"`); weights are `light` \| `normal` \| `medium` \| `semibold` \| `bold` \| `extrabold`. |
| **Draft language** | A page can hide just one language: its `description` starts with the marker `[[draft:ar]]` (`[[draft:en-ar]]` for both). The API returns it as `draftLangs: ["ar"]`. Non-admins get 404 for that language. |
| **Description markers** | `description` may start with `[[builtin:…]]`, `[[parent:…]]`, `[[draft:…]]` lines used by the admin (page tree / built-in pages). Treat them as metadata. |

> A page is visible on the website only when **the page is `published` AND the language is not a draft language**.

---

## 6. Endpoint summary

| # | Method | Path | Auth | Purpose |
|---|---|---|---|---|
| 1 | GET | `/api/public/get-pages` | – | List pages |
| 2 | GET | `/api/public/get-page` | – | One page with its blocks |
| 3 | POST / PATCH | `/api/public/update-page-status` | Admin | Publish/unpublish a page or one language |
| 4 | POST | `/api/public/create-component` | Admin | Add a block to a page |
| 5 | POST | `/api/public/update-component` | Admin | Edit a block (content, style, position, type) |
| 6 | POST / DELETE | `/api/public/delete-component` | Admin | Remove a block from a page |
| 7 | GET | `/api/public/get-header` | – | Site header document |
| 8 | PUT / POST | `/api/public/update-header` | Admin | Save site header |
| 9 | GET | `/api/public/get-footer` | – | Site footer document |
| 10 | PUT / POST | `/api/public/update-footer` | Admin | Save site footer |
| 11 | GET | `/api/public/offers` | – (admin sees all) | List offers |
| 12 | POST | `/api/public/offers` | Admin | Create offer |
| 13 | GET | `/api/public/offers/{id}` | – (admin sees all) | Get one offer |
| 14 | PUT | `/api/public/offers/{id}` | Admin | Replace offer |
| 15 | DELETE | `/api/public/offers/{id}` | Admin | Delete offer |
| 16 | PATCH | `/api/public/offers/{id}/status` | Admin | Change offer status |

---

## 7. Pages

### 7.1 `GET /api/public/get-pages` — list pages

All pages ordered by `slug`, with a block count.

**Query parameters**

| Name | Required | Values | Description |
|---|---|---|---|
| `lang` | no | `en` \| `ar` | When given, `componentCount` counts only that language's blocks. Unknown values are ignored. |
| `status` | no | `draft` \| `published` | Filter by page status. |

Anonymous callers only receive **published** pages; with an admin bearer you also get drafts.

**Example**

```http
GET /api/public/get-pages?lang=en
```

**200 OK**

```json
{
  "data": [
    {
      "id": "a177c4ea-22b1-4a24-9df2-5d5a8be2b2b1",
      "slug": "about-us",
      "label": "About Us",
      "description": "About Fly Cham — mission, vision, fleet, and FAQs",
      "status": "published",
      "isPublished": true,
      "draftLangs": [],
      "componentCount": 8,
      "createdAt": "2026-09-21T10:25:11.143698+00:00",
      "updatedAt": "2026-10-01T09:12:40.12+00:00"
    }
  ],
  "meta": {
    "count": 95,
    "publishedCount": 95,
    "draftCount": 0,
    "filters": { "status": null, "lang": "en" },
    "lang": "en",
    "dir": "ltr",
    "generatedAt": "2026-10-08T10:00:00.000Z"
  }
}
```

**Errors:** `500 query_failed`.

---

### 7.2 `GET /api/public/get-page` — one page with its blocks

**Query parameters**

| Name | Required | Values | Description |
|---|---|---|---|
| `slug` | **yes** | page slug | e.g. `home`, `about-us`, `allowed-baggage`, `test-page` |
| `lang` | no | `en` \| `ar` | Return only that language's blocks, and narrow each block's `content` / `style` to `{ "<lang>": {…} }`. Without it: all languages, full maps. |

**Example**

```http
GET /api/public/get-page?slug=allowed-baggage&lang=en
```

**200 OK** (trimmed to one block)

```json
{
  "id": "00324343-5c8d-4d3c-909d-752cd1bfb270",
  "slug": "allowed-baggage",
  "label": "Allowed Baggage",
  "description": "Baggage allowance by class, prohibited items, baggage FAQs and services",
  "status": "published",
  "isPublished": true,
  "draftLangs": [],
  "createdAt": "…",
  "updatedAt": "…",
  "blocks": [
    {
      "uid": "f793ee43-673e-4de0-bc37-d0b1070e14c4",
      "linkId": "a2b28eb7-e695-446c-8da9-461f5a80ed18",
      "sectionId": "cta-banner",
      "sectionLabel": "CTA Banner",
      "position": 4,
      "order": 4,
      "languages": ["en"],
      "style": { "en": { "bannerHeight": "medium", "showButton": true, "titleColor": "50" } },
      "content": {
        "en": {
          "title": "Prohibited & Dangerous Items",
          "description": "Learn about items that are restricted…",
          "imageUrl": "https://…/cms-media/allowed-baggage/prohibited.webp",
          "imageAlt": "Dangerous items sign at airport security",
          "buttonLabel": "Learn more",
          "buttonHref": "/help/faqs",
          "buttonLinkType": "internal",
          "buttonIcon": "ArrowRight",
          "links": []
        }
      },
      "createdAt": "…",
      "updatedAt": "…"
    }
  ],
  "meta": {
    "blockCount": 1,
    "sectionIds": ["cta-banner"],
    "languages": ["en"],
    "lang": "en",
    "dir": "ltr",
    "generatedAt": "…"
  }
}
```

**Block fields**

| Field | Meaning |
|---|---|
| `uid` | Component id — use it in update/delete calls |
| `linkId` | Id of the page↔component link |
| `sectionId` / `sectionLabel` | Component type id / human name (see [§13](#13-component-types-sectionid-in-use)) |
| `position` | Stored order value; `order` = 0-based index after sorting |
| `languages` | Languages that have authored `content` for this component |
| `style`, `content` | Per-language maps (see [§5](#5-how-content-is-modelled)). With `lang` and no content in that language → `content: {}` |

**Errors**

| Status | `code` | When |
|---|---|---|
| 400 | `missing_slug` | No `slug` |
| 404 | `page_not_found` | No such page, page not published (for non-admins), or `lang` is a draft language |
| 500 | `query_failed` | Database error |

---

### 7.3 `POST|PATCH /api/public/update-page-status` — publish / unpublish — **admin**

**Body**

| Field | Required | Type | Description |
|---|---|---|---|
| `slug` *or* `id` | **one of them** | string | Which page |
| `status` | **yes** | `"draft"` \| `"published"` | New status |
| `lang` | no | `"en"` \| `"ar"` | Without it: the **whole page** changes status. With it: only that language is hidden (`draft`) or shown again (`published`) via the `[[draft:…]]` marker. |

**Examples**

```json
{ "slug": "test-page", "status": "published" }
```

```json
{ "slug": "test-page", "lang": "ar", "status": "draft" }
```

**200 OK**

```json
{
  "data": {
    "id": "…", "slug": "test-page", "label": "test page", "description": "[[draft:ar]]",
    "status": "published", "isPublished": true, "draftLangs": ["ar"],
    "createdAt": "…", "updatedAt": "…"
  },
  "meta": { "changed": true, "lang": "ar", "generatedAt": "…" }
}
```

`meta.changed = false` when the page was already in that state.

**Errors:** `400 missing_page | invalid_status | invalid_lang | invalid_json`, `401 unauthorized` (no/expired token), `403 forbidden` (not admin), `404 not_found`.

---

## 8. Page components (blocks)

All three endpoints are **admin only** and return the resulting block in the same shape as `get-page` blocks (full `{en, ar}` maps), wrapped in `{ "data": block, "meta": { "generatedAt" } }`.

### 8.1 `POST /api/public/create-component` — add a block

| Field | Required | Type | Description |
|---|---|---|---|
| `slug` | **yes** | string | Page to add the block to |
| `type` | **yes** | string | Component type (`sectionId`), e.g. `cta-banner`, `page-hero`, `faqs` — see [§13](#13-component-types-sectionid-in-use) |
| `lang` | no | `"en"` \| `"ar"` | Language of the page the block belongs to. Default `en` |
| `position` | no | integer | Order within that language. Default: after the last block |
| `content` | no | object | `{ "en": { …fields of this type… } }` |
| `style` | no | object | `{ "en": { …style keys… } }` |

**Example**

```json
{
  "slug": "test-page",
  "type": "cta-banner",
  "lang": "en",
  "style": { "en": { "bannerHeight": "medium", "showButton": true, "titleColor": "50" } },
  "content": {
    "en": {
      "title": "Prohibited & Dangerous Items",
      "description": "Check what you can't bring on board before you fly.",
      "buttonLabel": "Learn more",
      "buttonHref": "/help/faqs",
      "buttonLinkType": "internal",
      "buttonIcon": "ArrowRight",
      "imageUrl": "",
      "imageAlt": "",
      "links": []
    }
  }
}
```

**201 Created** → `{ "data": { "uid": "…", "sectionId": "cta-banner", … }, "meta": {…} }`

> Tip: the easiest way to get a correct `content`/`style` for a type is to copy it from an existing block of the same `sectionId` via `get-page`.

**Errors:** `400 missing_slug | missing_type | invalid_json`, `401 unauthorized`, `403 forbidden`, `404 not_found` (page doesn't exist), `500 query_failed` (e.g. unknown `type`).

### 8.2 `POST /api/public/update-component` — edit a block

| Field | Required | Type | Description |
|---|---|---|---|
| `slug` | **yes** | string | Page the block is on |
| `uid` | **yes** | string | Component id (`componentId` accepted as alias) |
| `lang` | no | `"en"` \| `"ar"` | Which language's link to act on (matters for `position`). Default `en` |
| `content` | no | object | Per-language map. **Each language you send replaces that language's whole object**; languages you don't send are kept |
| `style` | no | object | Per-language map, merged the same way. A flat object (no `en`/`ar` keys) is applied to both languages |
| `position` | no | integer | New position within that language |
| `type` | no | string | Change the component type (rare) |

Send only the fields you want to change.

```json
{ "slug": "test-page", "uid": "<uid>", "lang": "en",
  "content": { "en": { "title": "New title", "description": "New description", "links": [] } } }
```

```json
{ "slug": "test-page", "uid": "<uid>", "lang": "en", "position": 0 }
```

> Reordering: positions of other blocks are **not** renumbered — send the new position for every block you move.

**200 OK** → updated block. **Errors:** `400 missing_slug | missing_uid | invalid_json`, `401`, `403 forbidden`, `404 not_found` (page missing or block not on that page/language), `500 query_failed`.

### 8.3 `POST|DELETE /api/public/delete-component` — remove a block

Unlinks a block from a page. The component row itself is kept (no hard delete).

| Field | Required | Description |
|---|---|---|
| `slug` | **yes** | Page |
| `uid` | **yes** | Component id (`componentId` alias) |
| `lang` | no | Remove only from this language. **Omit → removed from every language of the page** |

As JSON body (POST) or query string (DELETE):

```http
DELETE /api/public/delete-component?slug=test-page&uid=<uid>&lang=en
```

**200 OK**

```json
{ "data": { "slug": "test-page", "uid": "…", "linkId": "…", "linkIds": ["…"] }, "meta": { "generatedAt": "…" } }
```

**Errors:** `400 missing_slug | missing_uid | invalid_json`, `401`, `403`, `404 not_found`.

---

## 9. Site header

The website header (logo, mega-menus, login/region buttons, mobile menu, colours) is **one JSON document per language**, stored in table `site_header` with a `version` for optimistic locking.

### 9.1 `GET /api/public/get-header`

| Query | Required | Values |
|---|---|---|
| `lang` | no | `en` (default) \| `ar` — anything else → `400 invalid_lang` |

**200 OK**

```json
{
  "data": {
    "lang": "en",
    "version": 22,
    "updatedAt": "2026-10-08T07:51:58.392079+00:00",
    "document": { "schemaVersion": 1, "logo": {…}, "login": {…}, "region": {…}, "mobile": {…}, "menus": [ … ], "style": {…} }
  },
  "meta": { "generatedAt": "…" }
}
```

`404 not_found` → no header saved for that language yet (the website then uses its built-in default).
Cached 60 s (see [§4](#4-conventions)).

### 9.2 `PUT|POST /api/public/update-header` — **admin**

| Field | Required | Description |
|---|---|---|
| `lang` | **yes** | `"en"` \| `"ar"` |
| `version` | **yes** | The `version` you loaded with GET. `null` only when no header exists yet (GET returned 404) |
| `document` | **yes** | The complete header document (below) |

```json
{ "lang": "en", "version": 22, "document": { …full document… } }
```

**200 OK** → same shape as GET with `version` + 1.

| Status | `code` | When |
|---|---|---|
| 400 | `invalid_lang`, `invalid_version`, `invalid_json` | Bad field |
| 400 | `invalid_document` | Document fails validation — see `issues[]` (`path` like `menus[0].tabs[2].links[1].href`) |
| 401 | `unauthorized` | Missing/expired token |
| 403 | `forbidden` | Not an admin |
| 409 | `version_conflict` | Someone saved since you loaded. Body includes `currentVersion` — reload and re-apply |

### 9.3 Header document schema

Missing optional fields are filled with defaults; unknown keys are dropped.

```text
document
├─ schemaVersion: 1
├─ logo:   { lightUrl*, darkUrl*, alt, href, faviconUrl }
├─ login:  { show: bool, label, href }
├─ region: { show: bool, label }
├─ mobile (optional): { coverImageUrl, coverAlt, homeLabel, links: [ { id*, label*, href } ] (≤ 6) }
├─ menus: [ (≤ 8)
│    { id*, label, visible: bool,
│      tabs: [ (≤ 10)
│        { id*, label, icon, badge,
│          type: "links" | "destinations" | "activities" | "map",
│          withDescriptions: bool, imageUrl, imageAlt, ctaLabel, ctaHref,
│          links: [ { id*, title, description, icon, badge, href } ] (≤ 24),
│          cards: [ { id*, name, location, code, tag, imageUrl, href } ] (≤ 12) } ] } ]
└─ style: { 21 colour keys + 9 weight keys }
```

`*` = required / non-empty.

**Rules**

| Item | Rule |
|---|---|
| `id` | Letters, digits, `-`, `_`; ≤ 80 chars; unique among its siblings |
| Labels / titles | ≤ 80 chars. Descriptions / alt text ≤ 200 |
| `href` | `""`, an app path without language prefix (`/help`), an anchor (`#x`), or `http(s)://`, `mailto:`, `tel:` URL; ≤ 500 chars |
| Image URLs | `""`, a site path (`/…`), or `http(s)://` URL |
| `icon`, `badge` | `""` or a PascalCase [Phosphor](https://phosphoricons.com) icon name, e.g. `AirplaneTakeoff` |
| Style colours | Theme token: `^[A-Za-z0-9#-]+$`, e.g. `"700"`, `"primary-1"` |
| Style weights | `light` \| `normal` \| `medium` \| `semibold` \| `bold` \| `extrabold` |

**Style keys** — colours: `barBg, navColor, navColorHover, indicatorColor, panelBg, sidebarBg, tabColor, tabColorHover, iconColor, iconColorHover, linkTitleColor, linkTitleColorHover, linkDescriptionColor, ctaBarBg, ctaTextColor, inlineCtaColor, cardBarBg, cardTitleColor, cardMetaColor, tagBg, tagTextColor`; weights: `navFontWeight, navFontWeightHover, tabFontWeight, tabFontWeightHover, linkTitleFontWeight, linkTitleFontWeightHover, linkDescriptionFontWeight, ctaFontWeight, cardTitleFontWeight`.

---

## 10. Site footer

Same pattern as the header (table `site_footer`, one document per language, `version` locking). The GET response is **not cached** (`no-store`).

### 10.1 `GET /api/public/get-footer`

Query `lang` = `en` (default) \| `ar`. Response `{ data: { lang, document, version, updatedAt }, meta }`; `404 not_found` when never saved.

### 10.2 `PUT|POST /api/public/update-footer` — **admin**

Body `{ "lang", "version", "document" }` — identical rules, status codes and `409 version_conflict` behaviour as [update-header](#92-putpost-apipublicupdate-header--admin).

### 10.3 Footer document schema

```text
document
├─ schemaVersion: 1
├─ brand:  { logoUrl*, logoAlt, logoHref, followText (≤ 200), patternUrl }
├─ social: [ { id*, icon* (Phosphor), label, href, showOnMobile: bool } ] (≤ 12)
├─ columns: [ (≤ 10)
│    { id*, icon, title, href, group: 1 | 2 | 3 | 4,
│      links: [ { id*, icon, label, href, external: bool, highlight: bool } ] (≤ 20) } ]
├─ legal:  { copyright (≤ 200), links: [ { id*, label, href, showOnMobile: bool } ] (≤ 10) }
└─ style:  { showPattern: bool, 14 colour keys, 3 weight keys }
```

`group` = which of the 4 desktop footer columns the section is stacked into.

**Style keys** — colours: `bg, columnTitleColor, columnTitleColorHover, mobileTitleColor, mobileTitleColorHover, linkColor, linkColorHover, highlightColor, followTextColor, socialColor, socialColorHover, legalColor, legalColorHover, dividerColor`; weights: `columnTitleFontWeight, mobileTitleFontWeight, linkFontWeight`; plus `showPattern` (boolean).

Ids, labels (≤ 80), hrefs, image URLs, icons and tokens follow the same rules as the header.

---

## 11. Offers

Promotional offers managed in the admin (**/offers**) and shown by the offer blocks.

### 11.1 Offer object (API shape)

```json
{
  "id": "6b0f…-uuid",
  "code": "DAM-SUMMER-25",
  "title":       { "en": "Summer in Damascus", "ar": "صيف في دمشق" },
  "description": { "en": "Save on flights to Damascus this summer.", "ar": "وفّر على رحلاتك إلى دمشق هذا الصيف." },
  "type": "destination",
  "tripType": null,
  "details": { "origin": "DAM", "destination": "DXB", "cabinClass": "economy" },
  "discount": { "type": "percentage", "value": 20, "currency": null },
  "expiry": {
    "type": "time",
    "startsAt": "2026-10-10T00:00:00.000Z",
    "endsAt": "2026-12-31T23:59:59.000Z",
    "maxPassengers": null,
    "usedPassengers": 0,
    "remainingPassengers": null
  },
  "status": "active",
  "state": "scheduled",
  "createdAt": "…",
  "updatedAt": "…"
}
```

- `status` = what the admin set: `draft` \| `active` \| `inactive`.
- `state` = computed **right now**: same as `status`, except an `active` offer is `scheduled` before `startsAt`, and `expired` after `endsAt` (time expiry) or once `usedPassengers ≥ maxPassengers` (passenger expiry).

### 11.2 `GET /api/public/offers` — list

| Query | Required | Values |
|---|---|---|
| `type` | no | `destination` \| `trip` \| `baggage` \| `seat` \| `payment` |
| `status` | no | `draft` \| `active` \| `inactive` |
| `search` | no | Text matched (contains, case-insensitive) against `code`, `title.en`, `title.ar` |

Newest first. **Without a token only offers whose `state` is `active` are returned**; an admin token returns everything.
**200 OK** → `{ "data": [ offer, … ], "meta": { "generatedAt" } }`. **Errors:** `400 invalid_type | invalid_status`.

### 11.3 `GET /api/public/offers/{id}` — one offer

`400 invalid_id` (not a UUID), `404 not_found`.

### 11.4 `POST /api/public/offers` — create — **admin**

**Body**

| Field | Required | Rules |
|---|---|---|
| `code` | **yes** | 3–32 chars, `A–Z 0–9 -`, starts with letter/digit (lower-case is upper-cased). **Unique** |
| `title.en` | **yes** | 2–120 chars |
| `title.ar` | **yes** | 2–120 chars, must contain Arabic letters |
| `description.en` / `.ar` | no | ≤ 1000 chars |
| `type` | **yes** | `destination` \| `trip` \| `baggage` \| `seat` \| `payment` |
| `tripType` | for `trip` only | `one_way` \| `round_trip` \| `multi_city` (sending it for other types is an error) |
| `details` | **yes** | Object — depends on `type` (table below) |
| `discount.type` | **yes** | `percentage` \| `fixed` |
| `discount.value` | **yes** | `percentage`: 0.01–100 · `fixed`: 0.01–100000 |
| `discount.currency` | for `fixed` | 3-letter ISO code, e.g. `USD` |
| `expiry.type` | **yes** | `time` \| `passengers` |
| `expiry.startsAt` | **yes** | ISO date-time |
| `expiry.endsAt` | for `time` | ISO date-time, after `startsAt` |
| `expiry.maxPassengers` | for `passengers` | Integer 1–100000 |
| `status` | no | `draft` (default) \| `active` \| `inactive` |

**`details` per type**

| `type` | Fields |
|---|---|
| `destination` | `origin` (IATA, optional), `destination` (IATA, required, ≠ origin), `cabinClass`: `any` \| `economy` \| `business` |
| `trip` | `cabinClass`; `segments`: `[ { origin, destination } ]` — exactly **1** for `one_way` / `round_trip`, **2–6** for `multi_city` |
| `baggage` | `baggageType`: `checked` \| `cabin` \| `sports_equipment`; `weightKg`: integer 1–100 |
| `seat` | `seatType`: `standard` \| `extra_legroom` \| `exit_row` \| `front_row` \| `preferred`; `cabinClass` |
| `payment` | `paymentMethod`: `credit_card` \| `debit_card` \| `bank_transfer` \| `mobile_wallet` \| `cash`; `cardScheme` (cards only): `any` \| `visa` \| `mastercard` \| `amex`; `minSpend` (optional number 0–1000000) |

IATA = 3 upper-case letters (`DAM`, `DXB`, `AMM`).

**Example — multi-city**

```json
{
  "code": "MULTI-GULF",
  "title": { "en": "Gulf tour", "ar": "جولة الخليج" },
  "type": "trip",
  "tripType": "multi_city",
  "details": {
    "cabinClass": "business",
    "segments": [
      { "origin": "DAM", "destination": "DXB" },
      { "origin": "DXB", "destination": "DOH" },
      { "origin": "DOH", "destination": "DAM" }
    ]
  },
  "discount": { "type": "fixed", "value": 50, "currency": "USD" },
  "expiry": { "type": "passengers", "startsAt": "2026-10-10T00:00:00Z", "maxPassengers": 500 }
}
```

The Postman folder *Create offer — examples per type* has one ready body for each of the 7 variants.

**201 Created** → `{ "data": offer, "meta" }`

| Status | `code` | When |
|---|---|---|
| 400 | `invalid_offer` | Validation failed — `issues[]` with paths like `details.segments[1].origin` |
| 400 | `invalid_json` | Body not JSON |
| 401 | `unauthorized` | Missing/expired token |
| 403 | `forbidden` | Not an admin |
| 409 | `duplicate_code` | `code` already used |

### 11.5 `PUT /api/public/offers/{id}` — replace — **admin**

Same body and rules as create — **send the whole offer** (it replaces every editable field). Extra error: lowering `maxPassengers` below `usedPassengers` → `400 invalid_offer` on `expiry.maxPassengers`. `404 not_found` for unknown id.

### 11.6 `PATCH /api/public/offers/{id}/status` — **admin**

```json
{ "status": "active" }
```

`status`: `draft` \| `active` \| `inactive`. Activating an offer that is already past its end date / passenger limit → **`409 offer_expired`** (extend the expiry first). Returns the updated offer.

### 11.7 `DELETE /api/public/offers/{id}` — **admin**

Permanently deletes. **200 OK** → `{ "data": { "id": "…" }, "meta" }`.

---

## 12. Error codes reference

| HTTP | `code` | Meaning |
|---|---|---|
| 400 | `invalid_json` | Body is not valid JSON / not an object |
| 400 | `missing_slug`, `missing_type`, `missing_uid`, `missing_page` | Required field/param missing |
| 400 | `invalid_lang`, `invalid_status`, `invalid_type`, `invalid_version`, `invalid_id` | Value not allowed |
| 400 | `invalid_document` | Header/footer document failed validation (`issues[]`) |
| 400 | `invalid_offer` | Offer failed validation (`issues[]`) |
| 401 | `unauthorized` | No `Authorization: Bearer …`, or token expired/invalid → sign in / refresh |
| 403 | `forbidden` | Token is valid but the user isn't a CMS admin (or RLS refused) |
| 404 | `page_not_found` | `get-page`: page missing, unpublished, or draft language |
| 404 | `not_found` | Page / block / offer / header / footer not found |
| 409 | `version_conflict` | Header/footer saved by someone else meanwhile (`currentVersion` in body) |
| 409 | `duplicate_code` | Offer code already exists |
| 409 | `offer_expired` | Tried to activate an expired offer |
| 500 | `query_failed` | Unexpected database/server error (message has details) |

---

## 13. Component types (`sectionId`) in use

The 106 block types currently used on live pages. Use these as `type` in `create-component`. Each type's `content`/`style` fields are defined by its React block in `flychamadmin/src/cms2` and `new_fly_cham` — copy an existing block via `get-page` to see them.

| `sectionId` | Label | `sectionId` | Label |
|---|---|---|---|
| about-values | About Values | journey-section | Journey Section |
| airport-service-cards | Airport Service Cards | journey-stage-next-steps | Journey Stage Next Steps |
| baggage-addons | Baggage Add-ons | landmark-feature | Landmark Feature |
| baggage-allowance | Baggage Allowance | latest-news | Latest News |
| baggage-allowance-breakdown | Baggage Allowance Breakdown | legal-document | Legal Document |
| baggage-calculator | Baggage Calculator | legal-hub | Legal Hub |
| baggage-resource-cards | Baggage Resource Cards | legal-more-info | Legal More Info |
| baggage-route-summary | Baggage Route Summary | live-chat-banner | Live Chat Banner |
| before-you-fly-services | Before You Fly Services | lounge-cards | Lounge Cards |
| booking-lookup | Booking Lookup | magazine-banner | Magazine Banner |
| booking-widget | Booking Widget | magazine-view | Magazine View |
| breadcrumbs | Breadcrumbs | marhaba-intro | Marhaba Intro |
| business-quick-access | Business Quick Access | media-cards | Media Cards |
| cargo-info-cards | Cargo Info Cards | media-contact-cards | Media Contact Cards |
| cargo-shipment-types | Cargo Shipment Types | media-newsletter-signup | Media Newsletter Signup |
| cargo-stations-explorer | Cargo Stations Explorer | news-detail-figure | News Detail Figure |
| catalog-cards | Catalog Cards | news-detail-gallery | News Detail Gallery |
| cham-miles-join | Cham Miles Join | news-detail-header | News Detail Header |
| class-panel | Class Panel | news-detail-paragraphs | News Detail Paragraphs |
| coming-soon-hero | Coming Soon Hero | news-grid | News Grid |
| contact-cards | Contact Cards | newsletter-form | Newsletter Form |
| contact-forms | Contact Forms | newsletter-signup | Newsletter Signup |
| cta-banner | CTA Banner | offer-baggage | Baggage Offer |
| destination-hero-stats | Destination Hero + Stats | offer-cards | Offer Cards |
| destination-narratives | Destination Narratives | offer-destination | Destination Offer |
| destination-things-to-do | Destination Things to Do | offer-multi-city | Multi-city Offer |
| destinations-explore | Destinations Explore | offer-one-way | One-way Offer |
| destinations-inspiration | Destinations Inspiration | offer-payment-option | Payment Option Offer |
| explore-marhaba | Explore Marhaba | offer-round-trip | Round-trip Offer |
| faqs | FAQs | offer-seat | Seat Offer |
| feature-highlight | Feature Highlight | office-directory | Office Directory |
| fleet-explore | Fleet Explore | overlay-cards | Overlay Cards |
| form-access | Form Access | page-hero | Page Hero |
| forms-directory | Forms Directory | page-intro | Page Intro |
| gateway-cards | Gateway Cards | page-media-hero | Page Media Hero |
| get-help | Get Help | prohibited-items-grid | Prohibited Items Grid |
| get-in-touch | Get In Touch | promo-banner | Promo Banner |
| gsa-network | GSA Network | recent-news | Recent News |
| help-categories | Help Categories | responsibility-sections | Responsibility Sections |
| help-faqs | Help FAQs | route-map-explorer | Route Map Explorer |
| home-about | Home About | search-console | Search Console |
| home-cham-miles-banner | Home Cham Miles Banner | seat-choose | Seat Choose |
| home-plan-trip | Home Plan Trip | seat-journey | Seat Journey |
| home-travel-experience | Home Travel Experience | seat-plan | Seat Plan |
| icon-tiles | Icon Tiles | service-benefits | Service Benefits |
| info-accordion | Info Accordion | service-steps | Service Steps |
| instructions-card | Instructions Card | sights-grid | Sights Grid |
| site-map | Site Map | split-band | Split Band |
| split-cards | Split Cards | support-steps | Support Steps |
| title-with-list | Title With List | track-request | Track Request |
| travel-agent-login | Travel Agent Login | travel-experience-cards | Travel Experience Cards |
| travel-update-detail | Travel Update Detail | travel-update-hero | Travel Update Hero |
| travel-updates-advisory | Travel Updates Advisory | travel-updates-list | Travel Updates List |

---

## 14. Known issues

| Issue | Effect | Fix |
|---|---|---|
| **Anonymous `GET /offers` fails** on the live database with `403 forbidden — permission denied for function is_admin` | The public website can't list offers yet (admins with a token are fine) | Grant `EXECUTE` on `public.is_admin()` to `anon`, or rewrite the offers read policy so anon doesn't call it — part of applying the offers migration on the hosted DB |
| `get-header` is cached 60 s | A saved header can take up to a minute to show | By design (fast page loads). Footer is not cached |
| Block reorder doesn't renumber siblings | Two blocks can share a position | Send new positions for every moved block |

---

*Generated from the source of `cms/src/routes/api/public/*` and `cms/src/lib/*` on 2026-10-08.*
