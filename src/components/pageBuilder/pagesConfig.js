/**
 * Page definitions for the builder.
 *
 * A page is an ordered list of blocks. Each block is either:
 *   - a string  — a block id that seeds from the component's own demo data, or
 *   - an object — { sectionId, content?: { en, ar }, style? } to seed a reused
 *                 component with page-specific content/style (see presets/*).
 *
 * These are the seed/default compositions; a visitor's edits are saved per page
 * in the browser and take precedence on load.
 */
import { helpPageBlocks } from "./presets/help";
import { contactUsBlocks } from "./presets/contactUs";
import { ourOfficesBlocks } from "./presets/ourOffices";
import { ourGsaBlocks } from "./presets/ourGsa";
import { formsBlocks } from "./presets/forms";
import { faqsBlocks } from "./presets/faqs";

export const PAGES = [
  {
    slug: "help",
    label: "Help",
    description: "Help center — ported from the new Fly Cham app.",
    blocks: helpPageBlocks,
  },
  {
    slug: "contact-us",
    label: "Contact Us",
    description: "Contact channels, forms, and support — /help/contact-us.",
    blocks: contactUsBlocks,
  },
  {
    slug: "our-offices",
    label: "Our Offices",
    description: "Office locations by city — /help/contact-us/our-offices.",
    blocks: ourOfficesBlocks,
  },
  {
    slug: "our-gsa",
    label: "Our GSA",
    description: "General Sales Agents network — /help/contact-us/our-gsa.",
    blocks: ourGsaBlocks,
  },
  {
    slug: "forms",
    label: "Forms",
    description: "Support request forms and tracking — /help/contact-us/forms.",
    blocks: formsBlocks,
  },
  {
    slug: "faqs",
    label: "FAQs",
    description: "Frequently asked questions — /help/faqs.",
    blocks: faqsBlocks,
  },
];

export function getPage(slug) {
  return PAGES.find((page) => page.slug === slug) || null;
}

/** Section id of a block config (string or object form). */
export function blockConfigSectionId(block) {
  return typeof block === "string" ? block : block?.sectionId;
}
