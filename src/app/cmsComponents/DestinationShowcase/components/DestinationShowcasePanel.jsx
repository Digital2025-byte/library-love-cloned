"use client";

import PageContentContainer from "@/components/layout/PageContentContainer";
import DestinationShowcaseHeader from "./DestinationShowcaseHeader";
import DestinationShowcaseBanner from "./DestinationShowcaseBanner";
import useDestinationShowcase from "../hooks/useDestinationShowcase";
import { DEFAULT_DESTINATION_SHOWCASE_STYLE } from "../utils/style";

export default function DestinationShowcasePanel({
  lang = "en",
  content,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  const destinations = content.destinations || [];
  const slider = useDestinationShowcase(destinations);

  if (!destinations.length) return null;

  return (
    <>
      <PageContentContainer className="mb-0">
        <DestinationShowcaseHeader
          title={content.title}
          description={content.description}
          links={content.links}
          viewAllLabel={content.viewAllLabel}
          viewAllHref={content.viewAllHref}
          lang={lang}
          style={style}
        />
      </PageContentContainer>

      <div className="w-full md:mx-auto md:max-w-7xl md:px-6 lg:px-12">
        <DestinationShowcaseBanner
          lang={lang}
          exploreLabel={content.exploreLabel}
          current={slider.current}
          activeIndex={slider.activeIndex}
          direction={slider.direction}
          virtualIndex={slider.virtualIndex}
          jumping={slider.jumping}
          infiniteList={slider.infiniteList}
          destinationsLength={destinations.length}
          onPrev={slider.handlePrev}
          onNext={slider.handleNext}
          onCardClick={slider.handleCardClick}
          style={style}
        />
      </div>
    </>
  );
}
