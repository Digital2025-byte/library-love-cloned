"use client";

import { ScrollCarousel as ScrollCarouselLib } from "@/components/lightswind/scroll-carousel";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getThemeColorCss } from "@/styles/themeColors";
import { CARD_RADIUS_CLASS } from "../utils/style";

export default function ScrollCarouselPanel({ lang = "en", content, style }) {
  const { features = [], links = [] } = content;
  const showLinks = style.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(features, links)
    : null;

  const enrichedFeatures = features.map((feature, index) => ({
    ...feature,
    titleParts: itemLinkParts?.[index]?.titleParts,
    bodyParts: itemLinkParts?.[index]?.bodyParts,
  }));

  return (
    <section className="w-full" lang={lang}>
      <ScrollCarouselLib
        features={enrichedFeatures}
        showTitle={style.showTitle}
        showDescription={style.showDescription}
        showCardImage={style.showCardImage}
        showOverlay={style.showOverlay}
        showProgress={style.showProgress}
        showDots={false}
        showLinks={showLinks}
        linkStyle={style}
        cardRadiusClass={
          CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg
        }
        stageBgCss={
          style.showSectionBg
            ? getThemeColorCss(style.sectionBg, "foreground")
            : "transparent"
        }
        titleCss={
          style.titleColor
            ? getThemeColorCss(style.titleColor, "white")
            : undefined
        }
        descriptionCss={
          style.descriptionColor
            ? getThemeColorCss(style.descriptionColor, "white")
            : undefined
        }
      />
    </section>
  );
}
