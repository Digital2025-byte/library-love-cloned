"use client";

import { useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import useIsMobile from "@/hooks/useIsMobile";
import CarouselItemTitle from "./CarouselItemTitle";
import CarouselItemSlider from "./CarouselItemSlider";
import CarouselItemNavigation from "./CarouselItemNavigation";
import {
  buildSliderSettings,
  getActivePageIndex,
  getDestinations,
  getDotCount,
  resolvePageSlideIndex,
} from "../utils/helpers";
import { SECTION_PADDING_CLASS } from "../utils/style";

export default function CarouselItemPanel({
  lang = "en",
  content,
  style,
  posParams = "gb",
  cId,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const isMobile = useIsMobile(1024);

  const destinations = useMemo(() => getDestinations(content), [content]);
  const slideCount = destinations.length;
  const slidesPerView = isMobile ? 1 : 3;
  const slidesToScroll = slidesPerView;
  const dotCount = getDotCount(slideCount, isMobile, slidesPerView);
  const activePageIndex = isMobile
    ? Math.min(activeIndex, Math.max(0, slideCount - 1))
    : getActivePageIndex(activeIndex, slideCount, slidesPerView);
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ?? SECTION_PADDING_CLASS.default;

  const settings = useMemo(
    () =>
      buildSliderSettings({
        isMobile,
        slidesPerView,
        slidesToScroll,
        onBeforeChange: (_, next) => setActiveIndex(next),
      }),
    [isMobile, slidesPerView, slidesToScroll]
  );

  const handleNext = () => sliderRef.current?.slickNext();
  const handlePrev = () => sliderRef.current?.slickPrev();

  const goToPage = (pageIndex) => {
    const target = resolvePageSlideIndex({
      pageIndex,
      slideCount,
      isMobile,
      slidesPerView,
      slidesToScroll,
    });
    sliderRef.current?.slickGoTo(target);
  };

  if (!destinations.length) {
    return null;
  }

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="flex items-start justify-center"
      style={{
        backgroundColor: style.showSectionBg
          ? getThemeColorCss(style.sectionBg, "primary-800")
          : "transparent",
      }}
    >
      <PageContentContainer className="mb-8">
        <div className={paddingClass}>
          {style.showTitle ? (
            <CarouselItemTitle title={content?.title} style={style} />
          ) : null}
          <CarouselItemSlider
            sliderRef={sliderRef}
            settings={settings}
            destinations={destinations}
            lang={lang}
            posParams={posParams}
            cId={cId}
            style={style}
          />
          <CarouselItemNavigation
            dotCount={dotCount}
            activePageIndex={activePageIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onGoToPage={goToPage}
            style={style}
          />
        </div>
      </PageContentContainer>
    </section>
  );
}
