"use client";

/**
 * Block registry — the single source of truth for how the page builder
 * renders and edits each component type.
 *
 * Every entry exposes the same uniform contract so the builder can treat
 * all blocks the same way:
 *   - dataKey        key on the demo-data ctx that holds this block's seed data
 *   - defaultStyle   style object a freshly added block starts with
 *   - toEditorContent(data, lang)   demo payload -> editable content
 *   - wrapContent(content, lang)    editable content -> CMS-shaped data
 *   - Section        the live renderer (container + panel)
 *   - PropsForm      the inspector form (Content + Style tabs)
 *   - sectionProps   extra props passed straight to Section (e.g. posParams)
 *
 * To add a component to the builder, add one entry here — nothing else.
 */

import {
  isExternalHref,
  isInternalPage,
  resolveEditorLink,
} from "@/components/inspector";

import { PageHeroSection } from "@/app/cmsComponents/PageHero";
import PageHeroPropsForm from "@/app/cmsComponents/PageHero/docs/PageHeroPropsForm";
import {
  getPageHeroEditorContent,
  wrapPageHeroContent,
} from "@/app/cmsComponents/PageHero/utils/helpers";
import { DEFAULT_PAGE_HERO_STYLE } from "@/app/cmsComponents/PageHero/utils/style";

import { SearchConsoleSection } from "@/app/cmsComponents/SearchConsole";
import SearchConsolePropsForm from "@/app/cmsComponents/SearchConsole/docs/SearchConsolePropsForm";
import {
  getSearchConsoleEditorContent,
  wrapSearchConsoleContent,
} from "@/app/cmsComponents/SearchConsole/utils/helpers";
import { DEFAULT_SEARCH_CONSOLE_STYLE } from "@/app/cmsComponents/SearchConsole/utils/style";

import { HelpCategoriesSection } from "@/app/cmsComponents/HelpCategories";
import HelpCategoriesPropsForm from "@/app/cmsComponents/HelpCategories/docs/HelpCategoriesPropsForm";
import {
  getHelpCategoriesEditorContent,
  wrapHelpCategoriesContent,
} from "@/app/cmsComponents/HelpCategories/utils/helpers";
import { DEFAULT_HELP_CATEGORIES_STYLE } from "@/app/cmsComponents/HelpCategories/utils/style";

import { CtaBannerSection } from "@/app/cmsComponents/CtaBanner";
import CtaBannerPropsForm from "@/app/cmsComponents/CtaBanner/docs/CtaBannerPropsForm";
import {
  getCtaBannerEditorContent,
  wrapCtaBannerContent,
} from "@/app/cmsComponents/CtaBanner/utils/helpers";
import { DEFAULT_CTA_BANNER_STYLE } from "@/app/cmsComponents/CtaBanner/utils/style";

import { JourneySectionSection } from "@/app/cmsComponents/JourneySection";
import JourneySectionPropsForm from "@/app/cmsComponents/JourneySection/docs/JourneySectionPropsForm";
import {
  getJourneySectionEditorContent,
  wrapJourneySectionContent,
} from "@/app/cmsComponents/JourneySection/utils/helpers";
import { DEFAULT_JOURNEY_SECTION_STYLE } from "@/app/cmsComponents/JourneySection/utils/style";

import { LiveChatBannerSection } from "@/app/cmsComponents/LiveChatBanner";
import LiveChatBannerPropsForm from "@/app/cmsComponents/LiveChatBanner/docs/LiveChatBannerPropsForm";
import {
  getLiveChatBannerEditorContent,
  wrapLiveChatBannerContent,
} from "@/app/cmsComponents/LiveChatBanner/utils/helpers";
import { DEFAULT_LIVE_CHAT_BANNER_STYLE } from "@/app/cmsComponents/LiveChatBanner/utils/style";

import { GetInTouchSection } from "@/app/cmsComponents/GetInTouch";
import GetInTouchPropsForm from "@/app/cmsComponents/GetInTouch/docs/GetInTouchPropsForm";
import {
  getGetInTouchEditorContent,
  wrapGetInTouchContent,
} from "@/app/cmsComponents/GetInTouch/utils/helpers";
import { DEFAULT_GET_IN_TOUCH_STYLE } from "@/app/cmsComponents/GetInTouch/utils/style";

import { LocationDirectorySection } from "@/app/cmsComponents/LocationDirectory";
import LocationDirectoryPropsForm from "@/app/cmsComponents/LocationDirectory/docs/LocationDirectoryPropsForm";
import {
  getLocationDirectoryEditorContent,
  wrapLocationDirectoryContent,
} from "@/app/cmsComponents/LocationDirectory/utils/helpers";
import { DEFAULT_LOCATION_DIRECTORY_STYLE } from "@/app/cmsComponents/LocationDirectory/utils/style";

import { FaqExplorerSection } from "@/app/cmsComponents/FaqExplorer";
import FaqExplorerPropsForm from "@/app/cmsComponents/FaqExplorer/docs/FaqExplorerPropsForm";
import {
  getFaqExplorerEditorContent,
  wrapFaqExplorerContent,
} from "@/app/cmsComponents/FaqExplorer/utils/helpers";
import { DEFAULT_FAQ_EXPLORER_STYLE } from "@/app/cmsComponents/FaqExplorer/utils/style";

import { FormsDirectorySection } from "@/app/cmsComponents/FormsDirectory";
import FormsDirectoryPropsForm from "@/app/cmsComponents/FormsDirectory/docs/FormsDirectoryPropsForm";
import {
  getFormsDirectoryEditorContent,
  wrapFormsDirectoryContent,
} from "@/app/cmsComponents/FormsDirectory/utils/helpers";
import { DEFAULT_FORMS_DIRECTORY_STYLE } from "@/app/cmsComponents/FormsDirectory/utils/style";

import { TrackRequestSection } from "@/app/cmsComponents/TrackRequest";
import TrackRequestPropsForm from "@/app/cmsComponents/TrackRequest/docs/TrackRequestPropsForm";
import {
  getTrackRequestEditorContent,
  wrapTrackRequestContent,
} from "@/app/cmsComponents/TrackRequest/utils/helpers";
import { DEFAULT_TRACK_REQUEST_STYLE } from "@/app/cmsComponents/TrackRequest/utils/style";

import { ContactCardsSection } from "@/app/cmsComponents/ContactCards";
import ContactCardsPropsForm from "@/app/cmsComponents/ContactCards/docs/ContactCardsPropsForm";
import {
  getContactCardsEditorContent,
  wrapContactCardsContent,
} from "@/app/cmsComponents/ContactCards/utils/helpers";
import { DEFAULT_CONTACT_CARDS_STYLE } from "@/app/cmsComponents/ContactCards/utils/style";

import { PromoBannerSection } from "@/app/cmsComponents/PromoBanner";
import PromoBannerPropsForm from "@/app/cmsComponents/PromoBanner/docs/PromoBannerPropsForm";
import {
  getPromoBannerEditorContent,
  wrapPromoBannerContent,
} from "@/app/cmsComponents/PromoBanner/utils/helpers";
import { DEFAULT_PROMO_BANNER_STYLE } from "@/app/cmsComponents/PromoBanner/utils/style";

import { OfficeDirectorySection } from "@/app/cmsComponents/OfficeDirectory";
import OfficeDirectoryPropsForm from "@/app/cmsComponents/OfficeDirectory/docs/OfficeDirectoryPropsForm";
import {
  getOfficeDirectoryEditorContent,
  wrapOfficeDirectoryContent,
} from "@/app/cmsComponents/OfficeDirectory/utils/helpers";
import { DEFAULT_OFFICE_DIRECTORY_STYLE } from "@/app/cmsComponents/OfficeDirectory/utils/style";

/** Resolve a raw href into the { type, href } shape the inspector expects. */
function toEditorLink(href) {
  if (!href || href === "#") {
    return { type: "external", href: href || "" };
  }
  if (isExternalHref(href) || isInternalPage(href)) {
    return resolveEditorLink(href);
  }
  if (String(href).startsWith("/")) {
    return { type: "external", href };
  }
  return resolveEditorLink(href);
}

export const BLOCK_REGISTRY = {
  "page-hero": {
    id: "page-hero",
    label: "Page Hero",
    description: "Title, subtitle, and a side image.",
    dataKey: "pageHeroData",
    defaultStyle: DEFAULT_PAGE_HERO_STYLE,
    toEditorContent: (data, lang) => getPageHeroEditorContent(data, lang),
    wrapContent: (content, lang) => wrapPageHeroContent(content, lang),
    Section: PageHeroSection,
    PropsForm: PageHeroPropsForm,
    sectionProps: {},
  },
  "search-console": {
    id: "search-console",
    label: "Search Console",
    description: "Search field with popular topic chips.",
    dataKey: "searchConsoleData",
    defaultStyle: DEFAULT_SEARCH_CONSOLE_STYLE,
    toEditorContent: (data, lang) => getSearchConsoleEditorContent(data, lang),
    wrapContent: (content, lang) => wrapSearchConsoleContent(content, lang),
    Section: SearchConsoleSection,
    PropsForm: SearchConsolePropsForm,
    sectionProps: {},
  },
  "help-categories": {
    id: "help-categories",
    label: "Help Categories",
    description: "A grid of icon support cards.",
    dataKey: "helpCategoriesData",
    defaultStyle: DEFAULT_HELP_CATEGORIES_STYLE,
    toEditorContent: (data, lang) => getHelpCategoriesEditorContent(data, lang),
    wrapContent: (content, lang) => wrapHelpCategoriesContent(content, lang),
    Section: HelpCategoriesSection,
    PropsForm: HelpCategoriesPropsForm,
    sectionProps: {},
  },
  "cta-banner": {
    id: "cta-banner",
    label: "CTA Banner",
    description: "Full-width banner with an image and a call to action.",
    dataKey: "ctaBannerData",
    defaultStyle: DEFAULT_CTA_BANNER_STYLE,
    toEditorContent: (data, lang) => {
      const content = getCtaBannerEditorContent(data, lang, "gb");
      const link = toEditorLink(content.buttonHref);
      return { ...content, buttonHref: link.href, buttonLinkType: link.type };
    },
    wrapContent: (content, lang) => wrapCtaBannerContent(content, lang),
    Section: CtaBannerSection,
    PropsForm: CtaBannerPropsForm,
    sectionProps: { posParams: "gb" },
  },
  "journey-section": {
    id: "journey-section",
    label: "Journey Section",
    description: "Journey steps, each with a title and a link list.",
    dataKey: "journeySectionData",
    defaultStyle: DEFAULT_JOURNEY_SECTION_STYLE,
    toEditorContent: (data, lang) => getJourneySectionEditorContent(data, lang),
    wrapContent: (content, lang) => wrapJourneySectionContent(content, lang),
    Section: JourneySectionSection,
    PropsForm: JourneySectionPropsForm,
    sectionProps: {},
  },
  "live-chat-banner": {
    id: "live-chat-banner",
    label: "Live Chat Banner",
    description: "Compact support banner with an icon and a chat button.",
    dataKey: "liveChatBannerData",
    defaultStyle: DEFAULT_LIVE_CHAT_BANNER_STYLE,
    toEditorContent: (data, lang) => {
      const content = getLiveChatBannerEditorContent(data, lang, "gb");
      const link = toEditorLink(content.buttonHref);
      return { ...content, buttonHref: link.href, buttonLinkType: link.type };
    },
    wrapContent: (content, lang) => wrapLiveChatBannerContent(content, lang),
    Section: LiveChatBannerSection,
    PropsForm: LiveChatBannerPropsForm,
    sectionProps: { posParams: "gb" },
  },
  "get-in-touch": {
    id: "get-in-touch",
    label: "Get In Touch",
    description: "Centered contact block with an avatar and phone number.",
    dataKey: "getInTouchData",
    defaultStyle: DEFAULT_GET_IN_TOUCH_STYLE,
    toEditorContent: (data, lang) => getGetInTouchEditorContent(data, lang),
    wrapContent: (content, lang) => wrapGetInTouchContent(content, lang),
    Section: GetInTouchSection,
    PropsForm: GetInTouchPropsForm,
    sectionProps: {},
  },
  "location-directory": {
    id: "location-directory",
    label: "Location Directory",
    description: "Tabbed list of offices/agents with address and contacts.",
    dataKey: "locationDirectoryData",
    defaultStyle: DEFAULT_LOCATION_DIRECTORY_STYLE,
    toEditorContent: (data, lang) =>
      getLocationDirectoryEditorContent(data, lang),
    wrapContent: (content, lang) => wrapLocationDirectoryContent(content, lang),
    Section: LocationDirectorySection,
    PropsForm: LocationDirectoryPropsForm,
    sectionProps: {},
  },
  "faq-explorer": {
    id: "faq-explorer",
    label: "FAQ Explorer",
    description: "Categorized FAQ accordion with an optional browse button.",
    dataKey: "faqExplorerData",
    defaultStyle: DEFAULT_FAQ_EXPLORER_STYLE,
    toEditorContent: (data, lang) => {
      const content = getFaqExplorerEditorContent(data, lang);
      const link = toEditorLink(content.browseHref);
      return { ...content, browseHref: link.href, browseLinkType: link.type };
    },
    wrapContent: (content, lang) => wrapFaqExplorerContent(content, lang),
    Section: FaqExplorerSection,
    PropsForm: FaqExplorerPropsForm,
    sectionProps: {},
  },
  "forms-directory": {
    id: "forms-directory",
    label: "Forms Directory",
    description: "Tabbed grid of request forms grouped by travel stage.",
    dataKey: "formsDirectoryData",
    defaultStyle: DEFAULT_FORMS_DIRECTORY_STYLE,
    toEditorContent: (data, lang) => getFormsDirectoryEditorContent(data, lang),
    wrapContent: (content, lang) => wrapFormsDirectoryContent(content, lang),
    Section: FormsDirectorySection,
    PropsForm: FormsDirectoryPropsForm,
    sectionProps: {},
  },
  "track-request": {
    id: "track-request",
    label: "Track Request",
    description: "Case-number lookup form to check a request's status.",
    dataKey: "trackRequestData",
    defaultStyle: DEFAULT_TRACK_REQUEST_STYLE,
    toEditorContent: (data, lang) => getTrackRequestEditorContent(data, lang),
    wrapContent: (content, lang) => wrapTrackRequestContent(content, lang),
    Section: TrackRequestSection,
    PropsForm: TrackRequestPropsForm,
    sectionProps: {},
  },
  "contact-cards": {
    id: "contact-cards",
    label: "Contact Cards",
    description: "Icon card grid — channels, forms, or Get Help variants.",
    dataKey: "contactCardsData",
    defaultStyle: DEFAULT_CONTACT_CARDS_STYLE,
    toEditorContent: (data, lang) => getContactCardsEditorContent(data, lang),
    wrapContent: (content, lang) => wrapContactCardsContent(content, lang),
    Section: ContactCardsSection,
    PropsForm: ContactCardsPropsForm,
    sectionProps: {},
  },
  "promo-banner": {
    id: "promo-banner",
    label: "Promo Banner",
    description: "Full-bleed image banner with a navy wash and a CTA.",
    dataKey: "promoBannerData",
    defaultStyle: DEFAULT_PROMO_BANNER_STYLE,
    toEditorContent: (data, lang) => {
      const content = getPromoBannerEditorContent(data, lang);
      const link = toEditorLink(content.buttonHref);
      return { ...content, buttonHref: link.href, buttonLinkType: link.type };
    },
    wrapContent: (content, lang) => wrapPromoBannerContent(content, lang),
    Section: PromoBannerSection,
    PropsForm: PromoBannerPropsForm,
    sectionProps: {},
  },
  "office-directory": {
    id: "office-directory",
    label: "Office Directory",
    description: "City tabs + a timeline of offices with call/email actions.",
    dataKey: "officeDirectoryData",
    defaultStyle: DEFAULT_OFFICE_DIRECTORY_STYLE,
    toEditorContent: (data, lang) =>
      getOfficeDirectoryEditorContent(data, lang),
    wrapContent: (content, lang) => wrapOfficeDirectoryContent(content, lang),
    Section: OfficeDirectorySection,
    PropsForm: OfficeDirectoryPropsForm,
    sectionProps: {},
  },
};

/** All block ids known to the builder (used to preload their demo data). */
export const REGISTRY_BLOCK_IDS = Object.keys(BLOCK_REGISTRY);

export function getBlockEntry(id) {
  return BLOCK_REGISTRY[id] || null;
}

/** Lightweight list for the "Add component" picker. */
export const BLOCK_LIBRARY = REGISTRY_BLOCK_IDS.map((id) => ({
  id,
  label: BLOCK_REGISTRY[id].label,
  description: BLOCK_REGISTRY[id].description,
}));
