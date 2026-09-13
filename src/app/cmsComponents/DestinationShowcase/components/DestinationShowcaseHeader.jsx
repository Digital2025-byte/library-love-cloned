import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_DESTINATION_SHOWCASE_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function DestinationShowcaseHeader({
  title,
  description,
  links = [],
  viewAllLabel,
  viewAllHref,
  lang = "en",
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showBody = style.showDescription && description;
  const showViewAllLink = style.showViewAll && viewAllLabel && viewAllHref;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const showLinks = style.showLinks !== false;

  if (!showHeading && !showBody && !showViewAllLink) return null;

  return (
    <div className={`mb-6 flex flex-col gap-4 sm:mb-8 ${alignClass}`}>
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} font-semibold`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}

      {showBody || showViewAllLink ? (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {showBody ? (
            <p
              className={`${typography.sectionDescription} max-w-2xl ${
                style.titleAlign === "center" ? "mx-auto sm:mx-0" : ""
              }`}
              style={{ color: getThemeColorCss(style.descriptionColor, "700"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
            >
              <LinkedText
                text={description}
                links={links}
                style={style}
                enabled={showLinks}
              />
            </p>
          ) : (
            <span />
          )}

          {showViewAllLink ? (
            <Link
              href={viewAllHref}
              className={`${typography.button} inline-flex shrink-0 items-center gap-2 font-semibold hover:opacity-80`}
              style={{ color: getThemeColorCss(style.viewAllColor, "secondary-2") }}
            >
              {viewAllLabel}
              {lang === "ar" ? (
                <CaretLeftIcon size={16} weight="bold" aria-hidden />
              ) : (
                <CaretRightIcon size={16} weight="bold" aria-hidden />
              )}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
