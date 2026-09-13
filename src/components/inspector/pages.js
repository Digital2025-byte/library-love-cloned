export const INTERNAL_PAGES = [
  { label: "Home", href: "/gb/en" },
  { label: "About us", href: "/gb/en/about" },
  { label: "FAQs", href: "/gb/en/faqs" },
  { label: "Our destinations", href: "/gb/en/our-destinations" },
  { label: "Book a flight", href: "/gb/en/book" },
  { label: "Manage booking", href: "/gb/en/manage-booking" },
  { label: "Baggage", href: "/gb/en/baggage" },
  { label: "Contact us", href: "/gb/en/contact" },
];

export function isInternalPage(href) {
  return INTERNAL_PAGES.some((page) => page.href === href);
}

export function isExternalHref(href) {
  return /^(https?:|mailto:|tel:)/i.test(String(href || ""));
}

export function resolveEditorLink(href) {
  if (isExternalHref(href)) {
    return { type: "external", href };
  }

  if (isInternalPage(href)) {
    return { type: "internal", href };
  }

  return {
    type: "internal",
    href: INTERNAL_PAGES[0]?.href || "/",
  };
}
