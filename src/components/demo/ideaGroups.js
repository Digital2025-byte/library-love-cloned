/**
 * Idea groups for the CMS demo library.
 * Home (`/`) still renders every section; each slug page renders one group.
 */
export const IDEA_GROUPS = [
  {
    slug: "new-app",
    label: "New App",
    description: "Help page sections ported from the new Fly Cham app.",
    sectionIds: [
      "page-hero",
      "search-console",
      "help-categories",
      "cta-banner",
      "journey-section",
      "live-chat-banner",
      "get-in-touch",
      "location-directory",
      "faq-explorer",
      "forms-directory",
      "track-request",
      "contact-cards",
      "promo-banner",
      "office-directory",
    ],
  },
  {
    slug: "new",
    label: "New",
    description: "Latest Lightswind experiments.",
    sectionIds: ["three-d-slider", "cool-slide-gallery", "scroll-carousel"],
  },
  {
    slug: "accordion",
    label: "Accordion",
    description: "Expand and collapse content blocks.",
    sectionIds: ["accordion-with-content", "accordion-with-images"],
  },
  {
    slug: "carousel",
    label: "Carousel",
    description: "Sliders, stacked cards, and scrolling galleries.",
    sectionIds: [
      "slider",
      "image-carousels-with-opposite-scroll",
      "carousel-image-text-6",
      "service-cards-slider",
      "related-content-carousel",
      "cards-carousel-fill-image",
      "carousel-item",
      "destinations-cities",
      "destination-showcase",
      "on-board-image-ring",
    ],
  },
  {
    slug: "header",
    label: "Header",
    description: "Hero headers and banner CTAs.",
    sectionIds: [
      "full-height-header-with-text",
      "header-with-city-info",
      "header-with-three-image",
      "banner-with-cta",
      "banner-with-ctas-and-items",
    ],
  },
  {
    slug: "grid",
    label: "Grid",
    description: "Card grids, tiles, and fare boards.",
    sectionIds: [
      "grid-info",
      "simple-grid-with-prefix",
      "photo-tile-grid",
      "search-with-tabs-and-grid",
      "flight-fares-section",
    ],
  },
  {
    slug: "tabs",
    label: "Tabs",
    description: "Tabbed cards and filtered content.",
    sectionIds: ["tabbed-cards-section", "meals-description-tabbed"],
  },
  {
    slug: "images",
    label: "Images",
    description: "Image-led layouts and split compositions.",
    sectionIds: [
      "mixed-right-three-images",
      "cities-sections",
      "text-with-blob-image",
      "two-column-intro-with-two-image",
      "vertical-image-slice-text-section",
      "dual-image-text",
      "split-with-image",
      "section-with-animated-images",
    ],
  },
  {
    slug: "text",
    label: "Text",
    description: "Copy, lists, tables, and contact blocks.",
    sectionIds: [
      "paragraph",
      "split-text-only",
      "two-column-with-sub-sections",
      "service-benefits-list",
      "connection-steps-list",
      "title-with-list",
      "call-us",
      "data-table-with-image",
    ],
  },
  {
    slug: "map",
    label: "Map",
    description: "Destination and office maps.",
    sectionIds: ["map-info", "destinations-map"],
  },
  {
    slug: "form",
    label: "Form",
    description: "Survey form header and footer.",
    sectionIds: ["form-header", "form-footer"],
  },
  {
    slug: "legal",
    label: "Legal",
    description: "Privacy, cookies, and terms content.",
    sectionIds: [
      "legal-information-hero",
      "legal-information-cards",
      "legal-body-terms",
      "legal-body-cookies",
      "legal-body-privacy-policy",
    ],
  },
];

/** Home page section order — keep in sync with the current homepage. */
export const HOME_SECTION_IDS = [
  "full-height-header-with-text",
  "slider",
  "header-with-city-info",
  "mixed-right-three-images",
  "cities-sections",
  "banner-with-ctas-and-items",
  "banner-with-cta",
  "data-table-with-image",
  "accordion-with-content",
  "accordion-with-images",
  "paragraph",
  "text-with-blob-image",
  "call-us",
  "two-column-intro-with-two-image",
  "two-column-with-sub-sections",
  "service-benefits-list",
  "vertical-image-slice-text-section",
  "split-text-only",
  "tabbed-cards-section",
  "grid-info",
  "simple-grid-with-prefix",
  "map-info",
  "section-with-animated-images",
  "image-carousels-with-opposite-scroll",
  "header-with-three-image",
  "carousel-image-text-6",
  "flight-fares-section",
  "split-with-image",
  "service-cards-slider",
  "related-content-carousel",
  "cards-carousel-fill-image",
  "meals-description-tabbed",
  "connection-steps-list",
  "title-with-list",
  "search-with-tabs-and-grid",
  "photo-tile-grid",
  "dual-image-text",
  "on-board-image-ring",
  "three-d-slider",
  "cool-slide-gallery",
  "scroll-carousel",
  "destinations-map",
  "destination-showcase",
  "destinations-cities",
  "carousel-item",
  "legal-information-hero",
  "legal-information-cards",
  "legal-body-terms",
  "legal-body-cookies",
  "legal-body-privacy-policy",
  "form-header",
  "form-footer",
  "page-hero",
  "search-console",
  "help-categories",
  "cta-banner",
  "journey-section",
  "live-chat-banner",
  "get-in-touch",
  "location-directory",
  "faq-explorer",
  "forms-directory",
  "track-request",
  "contact-cards",
  "promo-banner",
  "office-directory",
];

export function getIdeaGroup(slug) {
  return IDEA_GROUPS.find((group) => group.slug === slug) || null;
}

export function getIdeaGroupForSection(sectionId) {
  return (
    IDEA_GROUPS.find((group) => group.sectionIds.includes(sectionId)) || null
  );
}

export function getDocsHref(sectionId) {
  return `/docs/${sectionId}`;
}

export function isKnownSectionId(sectionId) {
  return HOME_SECTION_IDS.includes(sectionId);
}
