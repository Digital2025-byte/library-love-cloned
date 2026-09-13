"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";

/**
 * Dev/demo component navigator — scroll to page sections by id.
 * Keep section ids in sync with wrappers in `src/app/page.js`.
 */
export const COMPONENT_NAV_ITEMS = [
  { id: "full-height-header-with-text", label: "FullHeightHeaderWithText" },
  { id: "slider", label: "Slider" },
  { id: "header-with-city-info", label: "HeaderWithCityInfo" },
  { id: "mixed-right-three-images", label: "MixedRightThreeImages" },
  { id: "cities-sections", label: "CitiesSections" },
  { id: "banner-with-ctas-and-items", label: "BannerWithCTAsAndItems" },
  { id: "banner-with-cta", label: "BannerWithCta" },
  { id: "data-table-with-image", label: "DataTableWithImage" },
  { id: "accordion-with-content", label: "AccordionWithContent" },
  { id: "accordion-with-images", label: "AccordionWithImages" },
  { id: "paragraph", label: "Paragraph" },
  { id: "text-with-blob-image", label: "TextWithBlobImage" },
  { id: "call-us", label: "CallUs" },
  { id: "two-column-intro-with-two-image", label: "TwoColumnIntroWithTwoImage" },
  { id: "two-column-with-sub-sections", label: "TwoColumnWithSubSections" },
  { id: "service-benefits-list", label: "ServiceBenefitsList" },
  {
    id: "vertical-image-slice-text-section",
    label: "VerticalImageSliceTextSection",
  },
  { id: "split-text-only", label: "SplitTextOnly" },
  { id: "tabbed-cards-section", label: "TabbedCardsSection" },
  { id: "grid-info", label: "GridInfo" },
  { id: "simple-grid-with-prefix", label: "SimpleGridWithPrefix" },
  { id: "map-info", label: "MapInfo" },
  { id: "section-with-animated-images", label: "SectionWithAnimatedImages" },
  {
    id: "image-carousels-with-opposite-scroll",
    label: "ImageCarouselsWithOppositeScrollDirections",
  },
  { id: "header-with-three-image", label: "HeaderWithThreeImage" },
  { id: "carousel-image-text-6", label: "CarouselImageText6" },
  { id: "flight-fares-section", label: "FlightFaresSection" },
  { id: "split-with-image", label: "SplitWithImage" },
  { id: "service-cards-slider", label: "ServiceCardsSlider" },
  { id: "related-content-carousel", label: "RelatedContentCarousel" },
  { id: "cards-carousel-fill-image", label: "CardsCarouselFillImage" },
  { id: "meals-description-tabbed", label: "MealsDescriptionTabbed" },
  { id: "connection-steps-list", label: "ConnectionStepsList" },
  { id: "title-with-list", label: "TitleWithList" },
  { id: "search-with-tabs-and-grid", label: "SearchWithTabsAndGrid" },
  { id: "dual-image-text", label: "DualImageText" },
  { id: "photo-tile-grid", label: "PhotoTileGrid" },
  { id: "on-board-image-ring", label: "OnBoardImageRing" },
  { id: "three-d-slider", label: "ThreeDSlider" },
  { id: "cool-slide-gallery", label: "CoolSlideGallery" },
  { id: "scroll-carousel", label: "ScrollCarousel" },
  { id: "carousel-item", label: "CarouselItem" },
  { id: "destinations-map", label: "DestinationsMap" },
  { id: "destinations-cities", label: "DestinationsCities" },
  { id: "destination-showcase", label: "DestinationShowcase" },
  { id: "legal-information-hero", label: "LegalInformationHero" },
  { id: "legal-information-cards", label: "LegalInformationCards" },
  { id: "legal-body-terms", label: "LegalBodyTerms" },
  { id: "legal-body-cookies", label: "LegalBodyCookies" },
  { id: "legal-body-privacy-policy", label: "LegalBodyPrivacyPolicy" },
  { id: "form-header", label: "FormHeader" },
  { id: "form-footer", label: "FormFooter" },
  { id: "page-hero", label: "PageHero" },
  { id: "search-console", label: "SearchConsole" },
  { id: "help-categories", label: "HelpCategories" },
  { id: "cta-banner", label: "CtaBanner" },
  { id: "journey-section", label: "JourneySection" },
  { id: "live-chat-banner", label: "LiveChatBanner" },
  { id: "get-in-touch", label: "GetInTouch" },
  { id: "location-directory", label: "LocationDirectory" },
  { id: "faq-explorer", label: "FaqExplorer" },
  { id: "forms-directory", label: "FormsDirectory" },
  { id: "track-request", label: "TrackRequest" },
  { id: "contact-cards", label: "ContactCards" },
  { id: "promo-banner", label: "PromoBanner" },
  { id: "office-directory", label: "OfficeDirectory" },
];

export default function ComponentNav({
  items = COMPONENT_NAV_ITEMS,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={open ? "Close components menu" : "Open components menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
          open
            ? "bg-primary-1 text-white"
            : "bg-background text-700 hover:bg-100"
        }`}
      >
        {open ? (
          <XIcon size={20} weight="bold" aria-hidden />
        ) : (
          <ListIcon size={20} weight="bold" aria-hidden />
        )}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Page components"
          className="absolute inset-e-0 top-full z-60 mt-2 max-h-[min(70vh,28rem)] w-[min(92vw,20rem)] overflow-y-auto rounded-lg border border-200 bg-background py-2 shadow-lg"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => scrollToSection(item.id)}
                  className="w-full px-3 py-2 text-start text-sm text-700 transition-colors hover:bg-100 hover:text-primary-1"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
