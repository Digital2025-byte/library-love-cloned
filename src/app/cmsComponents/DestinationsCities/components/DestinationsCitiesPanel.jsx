"use client";

import PageContentContainer from "@/components/layout/PageContentContainer";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getThemeColorCss } from "@/styles/themeColors";
import DestinationsCitiesIntro from "./DestinationsCitiesIntro";
import DestinationsCitiesStack from "./DestinationsCitiesStack";
import {
  DEFAULT_DESTINATIONS_CITIES_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function DestinationsCitiesPanel({
  lang = "en",
  content,
  style = DEFAULT_DESTINATIONS_CITIES_STYLE,
  posParams = "gb",
}) {
  const title = content.title || "";
  const description = content.description || "";
  const links = content.links || [];
  const cities = content.cities || [];
  const showLinks = style.showLinks !== false;
  const cityLinkParts = showLinks
    ? buildItemBacklinkParts(cities, links)
    : null;

  if (!title && !description && !cities.length) {
    return null;
  }

  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const showIntro = style.showTitle || style.showDescription;

  return (
    <section
      className={`overflow-hidden ${paddingClass}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        backgroundColor: style.showSectionBg
          ? getThemeColorCss(style.sectionBg, "primary-800")
          : "transparent",
      }}
    >
      <PageContentContainer className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,32%)_minmax(0,68%)] lg:items-center lg:gap-10 xl:gap-16">
        {showIntro ? (
          <DestinationsCitiesIntro
            title={title}
            description={description}
            links={links}
            style={style}
          />
        ) : (
          <div className="hidden lg:block" />
        )}
        <DestinationsCitiesStack
          cities={cities}
          cityLinkParts={cityLinkParts}
          lang={lang}
          posParams={posParams}
          style={style}
        />
      </PageContentContainer>
    </section>
  );
}
