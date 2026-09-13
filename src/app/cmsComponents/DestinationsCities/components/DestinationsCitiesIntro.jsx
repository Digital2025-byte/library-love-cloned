import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_DESTINATIONS_CITIES_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function DestinationsCitiesIntro({
  title = "",
  description = "",
  links = [],
  style = DEFAULT_DESTINATIONS_CITIES_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showBody = style.showDescription && description;
  const showLinks = style.showLinks !== false;

  if (!showHeading && !showBody) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div
      className={`w-full max-w-xl md:max-w-2xl lg:max-w-none lg:pr-4 xl:w-3/4 xl:pr-0 ${alignClass}`}
    >
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} mt-4 font-semibold whitespace-pre-line`}
          style={{ color: getThemeColorCss(style.titleColor, "50"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}
      {showBody ? (
        <p
          className={`${typography.sectionDescription} mt-6`}
          style={{
            color: `color-mix(in srgb, ${getThemeColorCss(style.descriptionColor, "50")} 80%, transparent)`,
            fontWeight: getFontWeightValue(style.descriptionFontWeight),
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
  );
}
