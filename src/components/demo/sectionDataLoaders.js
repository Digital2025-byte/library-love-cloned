/**
 * Lazy data builders keyed by section id.
 * Dynamic imports keep heavy image assets out of unrelated pages.
 */
export const SECTION_DATA_LOADERS = {
  "full-height-header-with-text": async (t, lang) => {
    const { buildFullHeightHeaderWithTextData } = await import(
      "@/app/cmsComponents/FullHeightHeaderWithText/utils/data"
    );
    return {
      fullHeightHeaderWithTextData: buildFullHeightHeaderWithTextData(t, lang),
    };
  },
  slider: async (t, lang) => {
    const { buildSliderData } = await import(
      "@/app/cmsComponents/Slider/utils/data"
    );
    return { sliderData: buildSliderData(t, lang) };
  },
  "header-with-city-info": async (t, lang) => {
    const { buildHeaderWithCityInfoData } = await import(
      "@/app/cmsComponents/HeaderWithCityInfo/utils/data"
    );
    return { headerWithCityInfoData: buildHeaderWithCityInfoData(t, lang) };
  },
  "mixed-right-three-images": async (t, lang) => {
    const [
      { buildMixedRightThreeImagesData },
      { buildMixedLeftThreeImagesData },
      { buildUpperRightThreeImagesData },
    ] = await Promise.all([
      import("@/app/cmsComponents/MixedRightThreeImages/utils/data"),
      import("@/app/cmsComponents/MixedLeftThreeImages/utils/data"),
      import("@/app/cmsComponents/UpperRightThreeImages/utils/data"),
    ]);
    return {
      mixedRightThreeImagesData: buildMixedRightThreeImagesData(t, lang),
      mixedLeftThreeImagesData: buildMixedLeftThreeImagesData(t, lang),
      upperRightThreeImagesData: buildUpperRightThreeImagesData(t, lang),
    };
  },
  "cities-sections": async (t, lang) => {
    const { buildCitiesSectionsData } = await import(
      "@/app/cmsComponents/CitiesSections/utils/data"
    );
    return { citiesSectionsData: buildCitiesSectionsData(t, lang) };
  },
  "banner-with-ctas-and-items": async (t, lang) => {
    const { buildBannerWithCTAsAndItemsData } = await import(
      "@/app/cmsComponents/BannerWithCTAsAndItems/utils/data"
    );
    return {
      bannerWithCTAsAndItemsData: buildBannerWithCTAsAndItemsData(t, lang),
    };
  },
  "banner-with-cta": async (t, lang) => {
    const { buildBannerWithCtaData } = await import(
      "@/app/cmsComponents/BannerWithCta/utils/data"
    );
    return { bannerWithCtaData: buildBannerWithCtaData(t, lang) };
  },
  "data-table-with-image": async (t, lang) => {
    const { buildDataTableWithImageData } = await import(
      "@/app/cmsComponents/DataTableWithImage/utils/data"
    );
    return { dataTableWithImageData: buildDataTableWithImageData(t, lang) };
  },
  "accordion-with-content": async (t) => {
    const { buildAccordionData } = await import(
      "@/app/cmsComponents/AccordionWithContent/utils/data"
    );
    return { accordionData: buildAccordionData(t) };
  },
  "accordion-with-images": async (t) => {
    const { buildAccordionWithImagesData } = await import(
      "@/app/cmsComponents/AccordionWithImages/utils/data"
    );
    return { accordionWithImagesData: buildAccordionWithImagesData(t) };
  },
  paragraph: async (t, lang) => {
    const { buildParagraphData } = await import(
      "@/app/cmsComponents/Paragraph/utils/data"
    );
    return { paragraphData: buildParagraphData(t, lang) };
  },
  "text-with-blob-image": async (t, lang) => {
    const { buildTextWithBlobData } = await import(
      "@/app/cmsComponents/TextWithBlobImage/utils/data"
    );
    return { textWithBlobData: buildTextWithBlobData(t, lang) };
  },
  "call-us": async (t) => {
    const { buildCallUsData } = await import(
      "@/app/cmsComponents/CallUs/utils/data"
    );
    return { callUsData: buildCallUsData(t) };
  },
  "two-column-intro-with-two-image": async (t) => {
    const { buildTwoColumnIntroData } = await import(
      "@/app/cmsComponents/TwoColumnIntroWithTwoImage/utils/data"
    );
    return { twoColumnIntroData: buildTwoColumnIntroData(t) };
  },
  "two-column-with-sub-sections": async (t) => {
    const { buildTwoColumnWithSubSectionsData } = await import(
      "@/app/cmsComponents/TwoColumnWithSubSections/utils/data"
    );
    return {
      twoColumnWithSubSectionsData: buildTwoColumnWithSubSectionsData(t),
    };
  },
  "service-benefits-list": async (t, lang) => {
    const { buildServiceBenefitsData } = await import(
      "@/app/cmsComponents/ServiceBenefitsList/utils/data"
    );
    return { serviceBenefitsData: buildServiceBenefitsData(t, lang) };
  },
  "vertical-image-slice-text-section": async (t, lang) => {
    const { buildVerticalImageSliceData } = await import(
      "@/app/cmsComponents/VerticalImageSliceTextSection/utils/data"
    );
    return { verticalImageSliceData: buildVerticalImageSliceData(t, lang) };
  },
  "split-text-only": async (t, lang) => {
    const { buildSplitTextOnlyData } = await import(
      "@/app/cmsComponents/SplitTextOnly/utils/data"
    );
    return { splitTextOnlyData: buildSplitTextOnlyData(t, lang) };
  },
  "tabbed-cards-section": async (t, lang) => {
    const { buildTabbedCardsData } = await import(
      "@/app/cmsComponents/TabbedCardsSection/utils/data"
    );
    return { tabbedCardsData: buildTabbedCardsData(t, lang) };
  },
  "grid-info": async (t, lang) => {
    const { buildGridInfoData } = await import(
      "@/app/cmsComponents/GridInfo/utils/data"
    );
    return { gridInfoData: buildGridInfoData(t, lang) };
  },
  "simple-grid-with-prefix": async (t, lang) => {
    const { buildSimpleGridWithPrefixData } = await import(
      "@/app/cmsComponents/SimpleGridWithPrefix/utils/data"
    );
    return {
      simpleGridWithPrefixData: buildSimpleGridWithPrefixData(t, lang),
    };
  },
  "map-info": async (t, lang) => {
    const { buildMapInfoData } = await import(
      "@/app/cmsComponents/MapInfo/utils/data"
    );
    return { mapInfoData: buildMapInfoData(t, lang) };
  },
  "section-with-animated-images": async (t, lang) => {
    const { buildSectionWithAnimatedImagesData } = await import(
      "@/app/cmsComponents/SectionWithAnimatedImages/utils/data"
    );
    return {
      sectionWithAnimatedImagesData: buildSectionWithAnimatedImagesData(
        t,
        lang
      ),
    };
  },
  "image-carousels-with-opposite-scroll": async (t, lang) => {
    const { buildImageCarouselsWithOppositeScrollData } = await import(
      "@/app/cmsComponents/ImageCarouselsWithOppositeScrollDirections/utils/data"
    );
    return {
      imageCarouselsWithOppositeScrollData:
        buildImageCarouselsWithOppositeScrollData(t, lang),
    };
  },
  "header-with-three-image": async (t, lang) => {
    const { buildHeaderWithThreeImageData } = await import(
      "@/app/cmsComponents/HeaderWithThreeImage/utils/data"
    );
    return {
      headerWithThreeImageData: buildHeaderWithThreeImageData(t, lang),
    };
  },
  "carousel-image-text-6": async (t, lang) => {
    const { buildCarouselImageText6Data } = await import(
      "@/app/cmsComponents/CarouselImageText6/utils/data"
    );
    return { carouselImageText6Data: buildCarouselImageText6Data(t, lang) };
  },
  "flight-fares-section": async (t, lang) => {
    const { buildFlightFaresData } = await import(
      "@/app/cmsComponents/FlightFaresSection/utils/data"
    );
    return { flightFaresData: buildFlightFaresData(t, lang) };
  },
  "split-with-image": async (t, lang) => {
    const { buildSplitWithImageData } = await import(
      "@/app/cmsComponents/SplitWithImage/utils/data"
    );
    return { splitWithImageData: buildSplitWithImageData(t, lang) };
  },
  "service-cards-slider": async (t, lang) => {
    const { buildServiceCardsSliderData } = await import(
      "@/app/cmsComponents/ServiceCardsSlider/utils/data"
    );
    return { serviceCardsSliderData: buildServiceCardsSliderData(t, lang) };
  },
  "related-content-carousel": async (t, lang) => {
    const { buildRelatedContentCarouselData } = await import(
      "@/app/cmsComponents/RelatedContentCarousel/utils/data"
    );
    return {
      relatedContentCarouselData: buildRelatedContentCarouselData(t, lang),
    };
  },
  "cards-carousel-fill-image": async (t, lang) => {
    const { buildCardsCarouselFillImageData } = await import(
      "@/app/cmsComponents/CardsCarouselFillImage/utils/data"
    );
    return {
      cardsCarouselFillImageData: buildCardsCarouselFillImageData(t, lang),
    };
  },
  "meals-description-tabbed": async (t, lang) => {
    const { buildMealsDescriptionTabbedData } = await import(
      "@/app/cmsComponents/MealsDescriptionTabbed/utils/data"
    );
    return {
      mealsDescriptionTabbedData: buildMealsDescriptionTabbedData(t, lang),
    };
  },
  "connection-steps-list": async (t, lang) => {
    const { buildConnectionStepsListData } = await import(
      "@/app/cmsComponents/ConnectionStepsList/utils/data"
    );
    return {
      connectionStepsListData: buildConnectionStepsListData(t, lang),
    };
  },
  "title-with-list": async (t, lang) => {
    const { buildTitleWithListData } = await import(
      "@/app/cmsComponents/TitleWithList/utils/data"
    );
    return { titleWithListData: buildTitleWithListData(t, lang) };
  },
  "search-with-tabs-and-grid": async (t, lang) => {
    const { buildSearchWithTabsAndGridData } = await import(
      "@/app/cmsComponents/SearchWithTabsAndGrid/utils/data"
    );
    return {
      searchWithTabsAndGridData: buildSearchWithTabsAndGridData(t, lang),
    };
  },
  "photo-tile-grid": async (t, lang) => {
    const { buildPhotoTileGridData } = await import(
      "@/app/cmsComponents/PhotoTileGrid/utils/data"
    );
    return { photoTileGridData: buildPhotoTileGridData(t, lang) };
  },
  "dual-image-text": async (t, lang) => {
    const { buildDualImageTextData } = await import(
      "@/app/cmsComponents/DualImageText/utils/data"
    );
    return {
      dualImageTextData: buildDualImageTextData(t, lang),
    };
  },
  "on-board-image-ring": async (t, lang) => {
    const { buildOnBoardImageRingData } = await import(
      "@/app/cmsComponents/OnBoardImageRing/utils/data"
    );
    return {
      onBoardImageRingData: buildOnBoardImageRingData(t, lang),
    };
  },
  "destinations-map": async (t, lang) => {
    const { buildDestinationsMapData } = await import(
      "@/app/cmsComponents/DestinationsMap/utils/data"
    );
    return { destinationsMapData: buildDestinationsMapData(t, lang) };
  },
  "destinations-cities": async (t, lang) => {
    const { buildDestinationsCitiesData } = await import(
      "@/app/cmsComponents/DestinationsCities/utils/data"
    );
    return { destinationsCitiesData: buildDestinationsCitiesData(t, lang) };
  },
  "destination-showcase": async (t, lang) => {
    const { buildDestinationShowcaseData } = await import(
      "@/app/cmsComponents/DestinationShowcase/utils/data"
    );
    return {
      destinationShowcaseData: buildDestinationShowcaseData(t, lang),
    };
  },
  "carousel-item": async (t, lang) => {
    const { buildCarouselItemData } = await import(
      "@/app/cmsComponents/CarouselItem/utils/data"
    );
    return { carouselItemData: buildCarouselItemData(t, lang) };
  },
  "legal-information-hero": async (t, lang) => {
    const { buildLegalInformationHeroData } = await import(
      "@/app/cmsComponents/LegalInformationHero/utils/data"
    );
    return {
      legalInformationHeroData: buildLegalInformationHeroData(t, lang),
    };
  },
  "legal-information-cards": async (t, lang) => {
    const { buildLegalInformationCardsData } = await import(
      "@/app/cmsComponents/LegalInformationCards/utils/data"
    );
    return {
      legalInformationCardsData: buildLegalInformationCardsData(t, lang),
    };
  },
  "legal-body-terms": async (t, lang) => {
    const { buildLegalBodyTermsData } = await import(
      "@/app/cmsComponents/LegalBodyTerms/utils/data"
    );
    return { legalBodyTermsData: buildLegalBodyTermsData(t, lang) };
  },
  "legal-body-cookies": async (_t, lang) => {
    const { buildLegalBodyCookiesData } = await import(
      "@/app/cmsComponents/LegalBodyCookies/utils/data"
    );
    return { legalBodyCookiesData: buildLegalBodyCookiesData(lang) };
  },
  "legal-body-privacy-policy": async (_t, lang) => {
    const { buildLegalBodyPrivacyPolicyData } = await import(
      "@/app/cmsComponents/LegalBodyPrivacyPolicy/utils/data"
    );
    return {
      legalBodyPrivacyPolicyData: buildLegalBodyPrivacyPolicyData(lang),
    };
  },
  "form-header": async (t, lang) => {
    const { buildFormHeaderData } = await import(
      "@/app/cmsComponents/FormHeader/utils/data"
    );
    return { formHeaderData: buildFormHeaderData(t, lang) };
  },
  "form-footer": async (t, lang) => {
    const { buildFormFooterData } = await import(
      "@/app/cmsComponents/FormFooter/utils/data"
    );
    return { formFooterData: buildFormFooterData(t, lang) };
  },
  "page-hero": async (t, lang) => {
    const { buildPageHeroData } = await import(
      "@/app/cmsComponents/PageHero/utils/data"
    );
    return { pageHeroData: buildPageHeroData(t, lang) };
  },
  "search-console": async (t, lang) => {
    const { buildSearchConsoleData } = await import(
      "@/app/cmsComponents/SearchConsole/utils/data"
    );
    return { searchConsoleData: buildSearchConsoleData(t, lang) };
  },
  "help-categories": async (t, lang) => {
    const { buildHelpCategoriesData } = await import(
      "@/app/cmsComponents/HelpCategories/utils/data"
    );
    return { helpCategoriesData: buildHelpCategoriesData(t, lang) };
  },
  "cta-banner": async (t, lang) => {
    const { buildCtaBannerData } = await import(
      "@/app/cmsComponents/CtaBanner/utils/data"
    );
    return { ctaBannerData: buildCtaBannerData(t, lang) };
  },
  "journey-section": async (t, lang) => {
    const { buildJourneySectionData } = await import(
      "@/app/cmsComponents/JourneySection/utils/data"
    );
    return { journeySectionData: buildJourneySectionData(t, lang) };
  },
  "live-chat-banner": async (t, lang) => {
    const { buildLiveChatBannerData } = await import(
      "@/app/cmsComponents/LiveChatBanner/utils/data"
    );
    return { liveChatBannerData: buildLiveChatBannerData(t, lang) };
  },
  "get-in-touch": async (t, lang) => {
    const { buildGetInTouchData } = await import(
      "@/app/cmsComponents/GetInTouch/utils/data"
    );
    return { getInTouchData: buildGetInTouchData(t, lang) };
  },
  "location-directory": async (t, lang) => {
    const { buildLocationDirectoryData } = await import(
      "@/app/cmsComponents/LocationDirectory/utils/data"
    );
    return { locationDirectoryData: buildLocationDirectoryData(t, lang) };
  },
  "faq-explorer": async (t, lang) => {
    const { buildFaqExplorerData } = await import(
      "@/app/cmsComponents/FaqExplorer/utils/data"
    );
    return { faqExplorerData: buildFaqExplorerData(t, lang) };
  },
  "forms-directory": async (t, lang) => {
    const { buildFormsDirectoryData } = await import(
      "@/app/cmsComponents/FormsDirectory/utils/data"
    );
    return { formsDirectoryData: buildFormsDirectoryData(t, lang) };
  },
  "track-request": async (t, lang) => {
    const { buildTrackRequestData } = await import(
      "@/app/cmsComponents/TrackRequest/utils/data"
    );
    return { trackRequestData: buildTrackRequestData(t, lang) };
  },
  "contact-cards": async (t, lang) => {
    const { buildContactCardsData } = await import(
      "@/app/cmsComponents/ContactCards/utils/data"
    );
    return { contactCardsData: buildContactCardsData(t, lang) };
  },
  "promo-banner": async (t, lang) => {
    const { buildPromoBannerData } = await import(
      "@/app/cmsComponents/PromoBanner/utils/data"
    );
    return { promoBannerData: buildPromoBannerData(t, lang) };
  },
  "office-directory": async (t, lang) => {
    const { buildOfficeDirectoryData } = await import(
      "@/app/cmsComponents/OfficeDirectory/utils/data"
    );
    return { officeDirectoryData: buildOfficeDirectoryData(t, lang) };
  },
};

export const ALL_SECTION_DATA_IDS = Object.keys(SECTION_DATA_LOADERS);
