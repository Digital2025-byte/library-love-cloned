import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { getHelpCategoryIcon } from "../utils/constants";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_HELP_CATEGORIES_STYLE,
} from "../utils/style";

export default function HelpCategoryCard({
  card,
  style = DEFAULT_HELP_CATEGORIES_STYLE,
}) {
  const Icon = getHelpCategoryIcon(card.icon);
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;

  const className = `group flex h-full flex-row items-center gap-3 border border-200 p-4 no-underline transition-shadow md:flex-col md:items-stretch md:justify-between md:gap-0 md:min-h-[220px] lg:min-h-[247px] md:border-0 md:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] ${radiusClass}`;

  const cardStyle = {
    backgroundColor: style.showCardBg
      ? getThemeColorCss(style.cardBg, "background")
      : "transparent",
  };

  const content = (
    <>
      <div className="flex min-w-0 flex-1 flex-row items-center gap-3 md:flex-col md:items-start md:gap-5">
        {style.showIcon ? (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11"
            style={{ backgroundColor: getThemeColorCss(style.iconBg, "100") }}
          >
            <Icon
              size={22}
              weight="regular"
              aria-hidden
              style={{ color: getThemeColorCss(style.iconColor, "700") }}
            />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1 md:gap-2">
          {style.showCardTitle ? (
            <h3
              className={`${typography.itemTitle} m-0`}
              style={{
                color: getThemeColorCss(style.cardTitleColor, "700"),
                fontWeight: getFontWeightValue(style.cardTitleFontWeight),
              }}
            >
              {card.title}
            </h3>
          ) : null}
          {style.showCardDescription ? (
            <p
              className={`${typography.caption} m-0 font-normal leading-snug`}
              style={{
                color: getThemeColorCss(style.cardDescriptionColor, "600"),
              }}
            >
              {card.description}
            </p>
          ) : null}
        </div>
      </div>
      {style.showArrow ? (
        <div className="shrink-0 md:mt-6 md:self-end">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: getThemeColorCss(style.arrowBg, "primary-1") }}
          >
            <ArrowRightIcon
              size={14}
              weight="bold"
              className="rtl:-scale-x-100"
              style={{ color: getThemeColorCss(style.arrowColor, "50") }}
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </>
  );

  if (card.href) {
    return (
      <Link href={card.href} className={className} style={cardStyle}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} style={cardStyle}>
      {content}
    </div>
  );
}
