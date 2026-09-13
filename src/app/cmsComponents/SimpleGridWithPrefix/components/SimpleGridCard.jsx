import Image from "next/image";
import { ArrowUpLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_SIMPLE_GRID_STYLE,
} from "../utils/style";
import { withCampaignPath } from "../utils/withCampaignPath";

export default function SimpleGridCard({
  lang = "en",
  item,
  cId,
  style = DEFAULT_SIMPLE_GRID_STYLE,
}) {
  if (!item) {
    return null;
  }

  const { title, link, userName, iconSrc, prefix = "", chip = "" } = item;
  const href = withCampaignPath(link, cId);
  const ArrowIcon = lang === "ar" ? ArrowUpLeftIcon : ArrowUpRightIcon;
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.sm;
  const chipCss = getThemeColorCss(style.chipBg, "secondary-100");
  const chipTextCss = getThemeColorCss(style.chipText, "primary-2");
  const showHeading = title || (style.showPrefix && prefix);

  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-stretch gap-4 ${radiusClass} px-4 py-5 no-underline transition-shadow`}
      style={{
        backgroundColor: style.showCardBg
          ? getThemeColorCss(style.cardBg, "white")
          : "transparent",
      }}
    >
      {style.showIcon ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={title || ""}
              fill
              className="object-contain"
              sizes="48px"
            />
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        {showHeading ? (
          <h4
            className={`${typography.itemDescription} truncate font-semibold`}
            style={{ color: getThemeColorCss(style.nameColor, "secondary-2"), fontWeight: getFontWeightValue(style.nameFontWeight) }}
          >
            {style.showPrefix && prefix ? `${prefix} ` : ""}
            {title}
          </h4>
        ) : null}
        {style.showChip && chip ? (
          <div className="mt-1.5 mb-1.5">
            <span
              className={`${typography.caption} inline-flex rounded-full px-2.5 py-0.5 font-medium`}
              style={{
                backgroundColor: `color-mix(in srgb, ${chipCss} 50%, transparent)`,
                color: chipTextCss,

                fontWeight: getFontWeightValue(style.chipTextFontWeight),
              }}
            >
              {chip}
            </span>
          </div>
        ) : null}
        {style.showUserName && userName ? (
          <p
            className={typography.caption}
            style={{ color: getThemeColorCss(style.userNameColor, "icon"), fontWeight: getFontWeightValue(style.userNameFontWeight) }}
          >
            {userName}
          </p>
        ) : null}
      </div>

      {style.showArrow ? (
        <ArrowIcon
          size={20}
          className="mt-auto shrink-0"
          style={{ color: getThemeColorCss(style.arrowColor, "primary-1") }}
        />
      ) : null}
    </a>
  );
}
