"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import CmsDemoChrome from "@/components/demo/CmsDemoChrome";
import { CmsDemoSections } from "@/components/demo/CmsDemoSections";
import {
  getIdeaGroupForSection,
  isKnownSectionId,
} from "@/components/demo/ideaGroups";
import useCmsDemoData from "@/components/demo/useCmsDemoData";
import AccordionWithContentExamples from "@/app/cmsComponents/AccordionWithContent/docs/AccordionWithContentExamples";
import AccordionWithImagesExamples from "@/app/cmsComponents/AccordionWithImages/docs/AccordionWithImagesExamples";
import BannerWithCtaExamples from "@/app/cmsComponents/BannerWithCta/docs/BannerWithCtaExamples";
import BannerWithCTAsAndItemsExamples from "@/app/cmsComponents/BannerWithCTAsAndItems/docs/BannerWithCTAsAndItemsExamples";
import CallUsExamples from "@/app/cmsComponents/CallUs/docs/CallUsExamples";
import CardsCarouselFillImageExamples from "@/app/cmsComponents/CardsCarouselFillImage/docs/CardsCarouselFillImageExamples";
import CarouselImageText6Examples from "@/app/cmsComponents/CarouselImageText6/docs/CarouselImageText6Examples";
import CarouselItemExamples from "@/app/cmsComponents/CarouselItem/docs/CarouselItemExamples";
import CitiesSectionsExamples from "@/app/cmsComponents/CitiesSections/docs/CitiesSectionsExamples";
import ConnectionStepsListExamples from "@/app/cmsComponents/ConnectionStepsList/docs/ConnectionStepsListExamples";
import CoolSlideGalleryExamples from "@/app/cmsComponents/CoolSlideGallery/docs/CoolSlideGalleryExamples";
import DataTableWithImageExamples from "@/app/cmsComponents/DataTableWithImage/docs/DataTableWithImageExamples";
import DestinationShowcaseExamples from "@/app/cmsComponents/DestinationShowcase/docs/DestinationShowcaseExamples";
import DestinationsCitiesExamples from "@/app/cmsComponents/DestinationsCities/docs/DestinationsCitiesExamples";
import DestinationsMapExamples from "@/app/cmsComponents/DestinationsMap/docs/DestinationsMapExamples";
import DualImageTextExamples from "@/app/cmsComponents/DualImageText/docs/DualImageTextExamples";
import FlightFaresSectionExamples from "@/app/cmsComponents/FlightFaresSection/docs/FlightFaresSectionExamples";
import FormFooterExamples from "@/app/cmsComponents/FormFooter/docs/FormFooterExamples";
import FormHeaderExamples from "@/app/cmsComponents/FormHeader/docs/FormHeaderExamples";
import FullHeightHeaderWithTextExamples from "@/app/cmsComponents/FullHeightHeaderWithText/docs/FullHeightHeaderWithTextExamples";
import GridInfoExamples from "@/app/cmsComponents/GridInfo/docs/GridInfoExamples";
import HeaderWithCityInfoExamples from "@/app/cmsComponents/HeaderWithCityInfo/docs/HeaderWithCityInfoExamples";
import HeaderWithThreeImageExamples from "@/app/cmsComponents/HeaderWithThreeImage/docs/HeaderWithThreeImageExamples";
import OppositeScrollExamples from "@/app/cmsComponents/ImageCarouselsWithOppositeScrollDirections/docs/OppositeScrollExamples";
import LegalBodyCookiesExamples from "@/app/cmsComponents/LegalBodyCookies/docs/LegalBodyCookiesExamples";
import LegalBodyPrivacyPolicyExamples from "@/app/cmsComponents/LegalBodyPrivacyPolicy/docs/LegalBodyPrivacyPolicyExamples";
import LegalBodyTermsExamples from "@/app/cmsComponents/LegalBodyTerms/docs/LegalBodyTermsExamples";
import LegalInformationCardsExamples from "@/app/cmsComponents/LegalInformationCards/docs/LegalInformationCardsExamples";
import LegalInformationHeroExamples from "@/app/cmsComponents/LegalInformationHero/docs/LegalInformationHeroExamples";
import MapInfoExamples from "@/app/cmsComponents/MapInfo/docs/MapInfoExamples";
import MealsDescriptionTabbedExamples from "@/app/cmsComponents/MealsDescriptionTabbed/docs/MealsDescriptionTabbedExamples";
import MixedRightThreeImagesExamples from "@/app/cmsComponents/MixedRightThreeImages/docs/MixedRightThreeImagesExamples";
import OnBoardImageRingExamples from "@/app/cmsComponents/OnBoardImageRing/docs/OnBoardImageRingExamples";
import ParagraphExamples from "@/app/cmsComponents/Paragraph/docs/ParagraphExamples";
import PhotoTileGridExamples from "@/app/cmsComponents/PhotoTileGrid/docs/PhotoTileGridExamples";
import RelatedContentCarouselExamples from "@/app/cmsComponents/RelatedContentCarousel/docs/RelatedContentCarouselExamples";
import ScrollCarouselExamples from "@/app/cmsComponents/ScrollCarousel/docs/ScrollCarouselExamples";
import SearchWithTabsAndGridExamples from "@/app/cmsComponents/SearchWithTabsAndGrid/docs/SearchWithTabsAndGridExamples";
import SectionWithAnimatedImagesExamples from "@/app/cmsComponents/SectionWithAnimatedImages/docs/SectionWithAnimatedImagesExamples";
import ServiceBenefitsListExamples from "@/app/cmsComponents/ServiceBenefitsList/docs/ServiceBenefitsListExamples";
import ServiceCardsSliderExamples from "@/app/cmsComponents/ServiceCardsSlider/docs/ServiceCardsSliderExamples";
import SimpleGridWithPrefixExamples from "@/app/cmsComponents/SimpleGridWithPrefix/docs/SimpleGridWithPrefixExamples";
import SliderExamples from "@/app/cmsComponents/Slider/docs/SliderExamples";
import SplitTextOnlyExamples from "@/app/cmsComponents/SplitTextOnly/docs/SplitTextOnlyExamples";
import SplitWithImageExamples from "@/app/cmsComponents/SplitWithImage/docs/SplitWithImageExamples";
import TabbedCardsSectionExamples from "@/app/cmsComponents/TabbedCardsSection/docs/TabbedCardsSectionExamples";
import TextWithBlobImageExamples from "@/app/cmsComponents/TextWithBlobImage/docs/TextWithBlobImageExamples";
import ThreeDSliderExamples from "@/app/cmsComponents/ThreeDSlider/docs/ThreeDSliderExamples";
import TitleWithListExamples from "@/app/cmsComponents/TitleWithList/docs/TitleWithListExamples";
import TwoColumnIntroWithTwoImageExamples from "@/app/cmsComponents/TwoColumnIntroWithTwoImage/docs/TwoColumnIntroWithTwoImageExamples";
import TwoColumnWithSubSectionsExamples from "@/app/cmsComponents/TwoColumnWithSubSections/docs/TwoColumnWithSubSectionsExamples";
import VerticalImageSliceTextSectionExamples from "@/app/cmsComponents/VerticalImageSliceTextSection/docs/VerticalImageSliceTextSectionExamples";
import PageHeroExamples from "@/app/cmsComponents/PageHero/docs/PageHeroExamples";
import SearchConsoleExamples from "@/app/cmsComponents/SearchConsole/docs/SearchConsoleExamples";
import HelpCategoriesExamples from "@/app/cmsComponents/HelpCategories/docs/HelpCategoriesExamples";
import CtaBannerExamples from "@/app/cmsComponents/CtaBanner/docs/CtaBannerExamples";
import JourneySectionExamples from "@/app/cmsComponents/JourneySection/docs/JourneySectionExamples";
import LiveChatBannerExamples from "@/app/cmsComponents/LiveChatBanner/docs/LiveChatBannerExamples";
import GetInTouchExamples from "@/app/cmsComponents/GetInTouch/docs/GetInTouchExamples";
import LocationDirectoryExamples from "@/app/cmsComponents/LocationDirectory/docs/LocationDirectoryExamples";
import FaqExplorerExamples from "@/app/cmsComponents/FaqExplorer/docs/FaqExplorerExamples";
import FormsDirectoryExamples from "@/app/cmsComponents/FormsDirectory/docs/FormsDirectoryExamples";
import TrackRequestExamples from "@/app/cmsComponents/TrackRequest/docs/TrackRequestExamples";
import ContactCardsExamples from "@/app/cmsComponents/ContactCards/docs/ContactCardsExamples";
import PromoBannerExamples from "@/app/cmsComponents/PromoBanner/docs/PromoBannerExamples";
import OfficeDirectoryExamples from "@/app/cmsComponents/OfficeDirectory/docs/OfficeDirectoryExamples";
import { COMPONENT_NAV_ITEMS } from "@/components/ui/ComponentNav";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";

const DOCS_EXAMPLES = {
  "dual-image-text": (ctx, label) => (
    <DualImageTextExamples ctx={ctx} name={label} />
  ),
  "accordion-with-content": (ctx, label) => (
    <AccordionWithContentExamples ctx={ctx} name={label} />
  ),
  "accordion-with-images": (ctx, label) => (
    <AccordionWithImagesExamples ctx={ctx} name={label} />
  ),
  "destination-showcase": (ctx, label) => (
    <DestinationShowcaseExamples ctx={ctx} name={label} />
  ),
  slider: (ctx, label) => <SliderExamples ctx={ctx} name={label} />,
  "three-d-slider": (ctx, label) => (
    <ThreeDSliderExamples ctx={ctx} name={label} />
  ),
  "on-board-image-ring": (ctx, label) => (
    <OnBoardImageRingExamples ctx={ctx} name={label} />
  ),
  "image-carousels-with-opposite-scroll": (ctx, label) => (
    <OppositeScrollExamples ctx={ctx} name={label} />
  ),
  "carousel-image-text-6": (ctx, label) => (
    <CarouselImageText6Examples ctx={ctx} name={label} />
  ),
  "service-cards-slider": (ctx, label) => (
    <ServiceCardsSliderExamples ctx={ctx} name={label} />
  ),
  "related-content-carousel": (ctx, label) => (
    <RelatedContentCarouselExamples ctx={ctx} name={label} />
  ),
  "cards-carousel-fill-image": (ctx, label) => (
    <CardsCarouselFillImageExamples ctx={ctx} name={label} />
  ),
  "carousel-item": (ctx, label) => (
    <CarouselItemExamples ctx={ctx} name={label} />
  ),
  "destinations-cities": (ctx, label) => (
    <DestinationsCitiesExamples ctx={ctx} name={label} />
  ),
  "full-height-header-with-text": (ctx, label) => (
    <FullHeightHeaderWithTextExamples ctx={ctx} name={label} />
  ),
  "header-with-city-info": (ctx, label) => (
    <HeaderWithCityInfoExamples ctx={ctx} name={label} />
  ),
  "header-with-three-image": (ctx, label) => (
    <HeaderWithThreeImageExamples ctx={ctx} name={label} />
  ),
  "banner-with-cta": (ctx, label) => (
    <BannerWithCtaExamples ctx={ctx} name={label} />
  ),
  "banner-with-ctas-and-items": (ctx, label) => (
    <BannerWithCTAsAndItemsExamples ctx={ctx} name={label} />
  ),
  "grid-info": (ctx, label) => <GridInfoExamples ctx={ctx} name={label} />,
  "simple-grid-with-prefix": (ctx, label) => (
    <SimpleGridWithPrefixExamples ctx={ctx} name={label} />
  ),
  "photo-tile-grid": (ctx, label) => (
    <PhotoTileGridExamples ctx={ctx} name={label} />
  ),
  "search-with-tabs-and-grid": (ctx, label) => (
    <SearchWithTabsAndGridExamples ctx={ctx} name={label} />
  ),
  "flight-fares-section": (ctx, label) => (
    <FlightFaresSectionExamples ctx={ctx} name={label} />
  ),
  "tabbed-cards-section": (ctx, label) => (
    <TabbedCardsSectionExamples ctx={ctx} name={label} />
  ),
  "meals-description-tabbed": (ctx, label) => (
    <MealsDescriptionTabbedExamples ctx={ctx} name={label} />
  ),
  "mixed-right-three-images": (ctx, label) => (
    <MixedRightThreeImagesExamples ctx={ctx} name={label} />
  ),
  "cities-sections": (ctx, label) => (
    <CitiesSectionsExamples ctx={ctx} name={label} />
  ),
  "text-with-blob-image": (ctx, label) => (
    <TextWithBlobImageExamples ctx={ctx} name={label} />
  ),
  "two-column-intro-with-two-image": (ctx, label) => (
    <TwoColumnIntroWithTwoImageExamples ctx={ctx} name={label} />
  ),
  "vertical-image-slice-text-section": (ctx, label) => (
    <VerticalImageSliceTextSectionExamples ctx={ctx} name={label} />
  ),
  "split-with-image": (ctx, label) => (
    <SplitWithImageExamples ctx={ctx} name={label} />
  ),
  "section-with-animated-images": (ctx, label) => (
    <SectionWithAnimatedImagesExamples ctx={ctx} name={label} />
  ),
  paragraph: (ctx, label) => <ParagraphExamples ctx={ctx} name={label} />,
  "split-text-only": (ctx, label) => (
    <SplitTextOnlyExamples ctx={ctx} name={label} />
  ),
  "two-column-with-sub-sections": (ctx, label) => (
    <TwoColumnWithSubSectionsExamples ctx={ctx} name={label} />
  ),
  "service-benefits-list": (ctx, label) => (
    <ServiceBenefitsListExamples ctx={ctx} name={label} />
  ),
  "connection-steps-list": (ctx, label) => (
    <ConnectionStepsListExamples ctx={ctx} name={label} />
  ),
  "title-with-list": (ctx, label) => (
    <TitleWithListExamples ctx={ctx} name={label} />
  ),
  "call-us": (ctx, label) => <CallUsExamples ctx={ctx} name={label} />,
  "data-table-with-image": (ctx, label) => (
    <DataTableWithImageExamples ctx={ctx} name={label} />
  ),
  "map-info": (ctx, label) => <MapInfoExamples ctx={ctx} name={label} />,
  "destinations-map": (ctx, label) => (
    <DestinationsMapExamples ctx={ctx} name={label} />
  ),
  "form-header": (ctx, label) => <FormHeaderExamples ctx={ctx} name={label} />,
  "form-footer": (ctx, label) => <FormFooterExamples ctx={ctx} name={label} />,
  "legal-information-hero": (ctx, label) => (
    <LegalInformationHeroExamples ctx={ctx} name={label} />
  ),
  "legal-information-cards": (ctx, label) => (
    <LegalInformationCardsExamples ctx={ctx} name={label} />
  ),
  "legal-body-terms": (ctx, label) => (
    <LegalBodyTermsExamples ctx={ctx} name={label} />
  ),
  "legal-body-cookies": (ctx, label) => (
    <LegalBodyCookiesExamples ctx={ctx} name={label} />
  ),
  "legal-body-privacy-policy": (ctx, label) => (
    <LegalBodyPrivacyPolicyExamples ctx={ctx} name={label} />
  ),
  "cool-slide-gallery": (ctx, label) => (
    <CoolSlideGalleryExamples ctx={ctx} name={label} />
  ),
  "scroll-carousel": (ctx, label) => (
    <ScrollCarouselExamples ctx={ctx} name={label} />
  ),
  "page-hero": (ctx, label) => <PageHeroExamples ctx={ctx} name={label} />,
  "search-console": (ctx, label) => (
    <SearchConsoleExamples ctx={ctx} name={label} />
  ),
  "help-categories": (ctx, label) => (
    <HelpCategoriesExamples ctx={ctx} name={label} />
  ),
  "cta-banner": (ctx, label) => <CtaBannerExamples ctx={ctx} name={label} />,
  "journey-section": (ctx, label) => (
    <JourneySectionExamples ctx={ctx} name={label} />
  ),
  "live-chat-banner": (ctx, label) => (
    <LiveChatBannerExamples ctx={ctx} name={label} />
  ),
  "get-in-touch": (ctx, label) => (
    <GetInTouchExamples ctx={ctx} name={label} />
  ),
  "location-directory": (ctx, label) => (
    <LocationDirectoryExamples ctx={ctx} name={label} />
  ),
  "faq-explorer": (ctx, label) => (
    <FaqExplorerExamples ctx={ctx} name={label} />
  ),
  "forms-directory": (ctx, label) => (
    <FormsDirectoryExamples ctx={ctx} name={label} />
  ),
  "track-request": (ctx, label) => (
    <TrackRequestExamples ctx={ctx} name={label} />
  ),
  "contact-cards": (ctx, label) => (
    <ContactCardsExamples ctx={ctx} name={label} />
  ),
  "promo-banner": (ctx, label) => (
    <PromoBannerExamples ctx={ctx} name={label} />
  ),
  "office-directory": (ctx, label) => (
    <OfficeDirectoryExamples ctx={ctx} name={label} />
  ),
};

export default function DocsComponentPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const known = isKnownSectionId(slug);
  const sectionIds = useMemo(() => (slug ? [slug] : []), [slug]);
  const ctx = useCmsDemoData(sectionIds);
  const label =
    COMPONENT_NAV_ITEMS.find((item) => item.id === slug)?.label || slug;
  const group = getIdeaGroupForSection(slug);
  const renderExamples = DOCS_EXAMPLES[slug];

  if (!known) {
    return (
      <CmsDemoChrome overlay={false} sectionIds={[]}>
        <PageContentContainer className="py-24">
          <h1 className={`${typography.pageTitle} font-semibold text-main`}>
            Component not found
          </h1>
          <p className={`${typography.body} mt-3 text-700`}>
            No demo page exists for “{slug}”.
          </p>
        </PageContentContainer>
      </CmsDemoChrome>
    );
  }

  return (
    <CmsDemoChrome overlay={false} sectionIds={[slug]}>
      <div className="border-b border-200 bg-50 py-10">
        <PageContentContainer>
          {group ? (
            <p className={`${typography.caption} text-500`}>{group.label}</p>
          ) : null}
          <h1 className={`${typography.pageTitle} mt-1 font-semibold text-main`}>
            {label}
          </h1>
        </PageContentContainer>
      </div>
      {renderExamples ? (
        renderExamples(ctx, label)
      ) : (
        <CmsDemoSections ids={[slug]} ctx={ctx} />
      )}
    </CmsDemoChrome>
  );
}
