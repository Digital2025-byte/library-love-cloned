import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_FULL_HEIGHT_HEADER_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function FullHeightHeaderWithTextContent({
  lang = "en",
  content,
  style = DEFAULT_FULL_HEIGHT_HEADER_STYLE,
  cId,
}) {
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeftIcon : ArrowRightIcon;
  const title = content.title;
  const description = content.description;
  const links = content.links || [];
  const buttonLabel = content.buttonText;
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;
  const showCta = style.showButton && buttonLabel;
  const isCenter = style.titleAlign === "center";
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const titleCss = getThemeColorCss(style.titleColor, "secondary-100");
  const descriptionCss = getThemeColorCss(
    style.descriptionColor,
    "secondary-100"
  );
  const pillCss = getThemeColorCss(style.buttonBg, "primary-2");
  const labelCss = getThemeColorCss(style.buttonText, "white");

  if (!showHeading && !showCopy && !showCta) {
    return null;
  }

  return (
    <div
      className={`flex w-full max-w-xl flex-col ${alignClass} ${
        isCenter ? "mx-auto items-center" : "items-start"
      }`}
    >
      {showHeading ? (
        <h1
          className={`${typography.sectionTitle} max-w-lg font-semibold`}
          style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h1>
      ) : null}

      {showCopy ? (
        <p
          className={`${typography.sectionDescription} mt-3 max-w-md leading-relaxed sm:mt-4`}
          style={{ color: descriptionCss, fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
        >
          <LinkedText
            text={description}
            links={links}
            style={style}
            enabled={style.showLinks !== false}
          />
        </p>
      ) : null}

      {showCta ? (
        <div className="mt-5 sm:mt-6">
          <Button
            label={buttonLabel}
            href={content.ctaHref || undefined}
            cId={cId}
            variant="primary"
            icon={<ArrowIcon size={20} weight="regular" aria-hidden />}
            iconPosition="end"
            className="min-w-[140px] sm:min-w-[160px]"
            style={{
              backgroundColor: pillCss,
              borderColor: pillCss,
              color: labelCss,
              fontWeight: getFontWeightValue(style.buttonTextFontWeight),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
