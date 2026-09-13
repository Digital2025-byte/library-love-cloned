import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { getFormIcon } from "../utils/constants";
import { CARD_RADIUS_CLASS, DEFAULT_FORMS_DIRECTORY_STYLE } from "../utils/style";

export default function FormCard({
  card,
  style = DEFAULT_FORMS_DIRECTORY_STYLE,
}) {
  const Icon = getFormIcon(card.icon);
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const iconColor = getThemeColorCss(style.iconColor, "700");
  const categoryCss = getThemeColorCss(style.categoryColor, "primary-1");

  const className = `flex h-full w-full flex-col gap-4 p-5 md:p-6 text-start no-underline text-inherit shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] ${radiusClass}`;
  const cardStyle = {
    backgroundColor: style.showCardBg
      ? getThemeColorCss(style.cardBg, "background")
      : "transparent",
  };

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        {style.showIcon ? (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11"
            style={{ backgroundColor: getThemeColorCss(style.iconBg, "100") }}
          >
            <Icon size={22} weight="regular" aria-hidden style={{ color: iconColor }} />
          </span>
        ) : null}
        {style.showCategory && card.category ? (
          <span
            className={`${typography.caption} whitespace-nowrap rounded-full px-3 py-1 font-medium`}
            style={{
              color: categoryCss,
              backgroundColor: `color-mix(in srgb, ${categoryCss} 20%, transparent)`,
            }}
          >
            {card.category}
          </span>
        ) : null}
      </div>

      <h3
        className={`${typography.itemTitle} m-0`}
        style={{
          color: getThemeColorCss(style.cardTitleColor, "700"),
          fontWeight: getFontWeightValue(style.cardTitleFontWeight),
        }}
      >
        {card.title}
      </h3>

      <div className="mt-auto flex items-end justify-between gap-3">
        {style.showDescription && card.description ? (
          <p
            className={`${typography.caption} m-0 flex-1 leading-snug`}
            style={{ color: getThemeColorCss(style.descriptionColor, "600") }}
          >
            {card.description}
          </p>
        ) : (
          <span className="flex-1" />
        )}
        {style.showArrow ? (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: getThemeColorCss(style.arrowBg, "primary-1") }}
          >
            <ArrowRightIcon
              size={14}
              weight="bold"
              aria-hidden
              className="rtl:-scale-x-100"
              style={{ color: getThemeColorCss(style.arrowColor, "50") }}
            />
          </div>
        ) : null}
      </div>
    </>
  );

  if (card.href) {
    return (
      <Link href={card.href} className={className} style={cardStyle}>
        {body}
      </Link>
    );
  }
  return (
    <div className={className} style={cardStyle}>
      {body}
    </div>
  );
}
