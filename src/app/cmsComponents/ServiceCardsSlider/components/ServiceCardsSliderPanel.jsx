import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { buildItemBacklinkParts, LinkedText } from "@/app/cmsComponents/shared/backlinks";
import ServiceCard from "./ServiceCard";
import {
  CARD_GAP_CLASS,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function ServiceCardsSliderPanel({
  lang = "en",
  content,
  style,
}) {
  const { title, description, links = [], services = [] } = content;
  const isRtl = lang === "ar";
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;
  const showHeading =
    (style.showTitle && title) || (style.showDescription && description);
  const showLinks = style.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(services, links)
    : null;

  if (!services.length && !showHeading) {
    return null;
  }

  return (
    <section
      className={`w-full ${paddingClass}`}
      dir={isRtl ? "rtl" : "ltr"}
      style={{ backgroundColor: getThemeColorCss(style.sectionBg, "white") }}
    >
      <PageContentContainer>
        {showHeading ? (
          <div className={`mb-6 md:mb-8 ${alignClass}`}>
            {style.showTitle && title ? (
              <h2
                className={`${typography.sectionTitle} font-semibold`}
                style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
              >
                {title}
              </h2>
            ) : null}
            {style.showDescription && description ? (
              <p
                className={`${typography.sectionDescription} mt-2 ${
                  style.titleAlign === "center" ? "mx-auto max-w-3xl" : ""
                }`}
                style={{ color: getThemeColorCss(style.descriptionColor, "secondary-2"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
                }}
              >
                <LinkedText
                  text={description}
                  links={links}
                  style={style}
                  enabled={showLinks}
                />
              </p>
            ) : null}
          </div>
        ) : null}

        {services.length ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClass}`}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={`${service.title}-${index}`}
                service={service}
                titleParts={itemLinkParts?.[index]?.titleParts}
                bodyParts={itemLinkParts?.[index]?.bodyParts}
                isRtl={isRtl}
                style={style}
              />
            ))}
          </div>
        ) : null}
      </PageContentContainer>
    </section>
  );
}
