"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { getContactIcon } from "../utils/constants";
import { DEFAULT_CONTACT_CARDS_STYLE } from "../utils/style";

/**
 * Renders one card in the exact source markup for the chosen variant:
 *   channels → rounded-2xl, icon+title, description, full-width CTA button
 *   forms    → rounded-lg link card, icon, title, description + arrow badge
 *   getHelp  → rounded-2xl bordered link card, icon+title, description, arrow badge
 */
export default function ContactCard({
  card,
  style = DEFAULT_CONTACT_CARDS_STYLE,
}) {
  const [buttonHovered, setButtonHovered] = useState(false);
  const [buttonFocused, setButtonFocused] = useState(false);
  const Icon = getContactIcon(card.icon);
  const iconBg = getThemeColorCss(style.iconBg, "100");
  const iconColor = getThemeColorCss(style.iconColor, "700");
  const cardBg = getThemeColorCss(style.cardBg, "background");
  const titleColor = getThemeColorCss(style.cardTitleColor, "700");
  const titleWeight = getFontWeightValue(style.cardTitleFontWeight);
  const descColor = getThemeColorCss(style.cardDescriptionColor, "600");
  const arrowBg = getThemeColorCss(style.arrowBg, "primary-1");
  const arrowColor = getThemeColorCss(style.arrowColor, "50");

  const iconBadge = (round, size = 22) => (
    <div
      className={`flex items-center justify-center shrink-0 ${round}`}
      style={{ backgroundColor: iconBg, color: iconColor }}
    >
      <Icon size={size} weight="regular" style={{ color: iconColor }} />
    </div>
  );

  const arrowBadge = (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: arrowBg }}
    >
      <ArrowRightIcon
        size={14}
        weight="bold"
        className="rtl:-scale-x-100"
        style={{ color: arrowColor }}
      />
    </div>
  );

  if (style.variant === "forms") {
    return (
      <Link
        href={card.href || "#"}
        className="flex flex-col gap-3 rounded-lg p-5 no-underline text-inherit"
        style={{ backgroundColor: cardBg }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={22} weight="regular" style={{ color: iconColor }} />
        </div>
        <h3
          className={`${typography.itemTitle} m-0`}
          style={{ color: titleColor, fontWeight: titleWeight }}
        >
          {card.title}
        </h3>
        <div className="flex items-end justify-between gap-3">
          <p
            className={`${typography.caption} m-0 flex-1 font-normal leading-snug`}
            style={{ color: getThemeColorCss(style.cardDescriptionColor, "700") }}
          >
            {card.description}
          </p>
          {arrowBadge}
        </div>
      </Link>
    );
  }

  if (style.variant === "getHelp") {
    return (
      <Link
        href={card.href || "#"}
        className="flex flex-col justify-between gap-6 rounded-2xl border border-200 p-5 no-underline text-inherit transition-colors hover:border-300 md:p-6"
        style={{ backgroundColor: cardBg }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Icon
              size={22}
              weight="regular"
              className="shrink-0"
              style={{ color: iconColor }}
            />
            <h3
              className={`${typography.itemTitle} m-0`}
              style={{ color: titleColor, fontWeight: titleWeight }}
            >
              {card.title}
            </h3>
          </div>
          <p
            className={`${typography.itemDescription} m-0 leading-relaxed`}
            style={{ color: getThemeColorCss(style.cardDescriptionColor, "800") }}
          >
            {card.description}
          </p>
        </div>
        <div className="self-end">{arrowBadge}</div>
      </Link>
    );
  }

  // channels (default)
  return (
    <article
      className="flex flex-col gap-4 rounded-2xl border border-200 p-5 md:border-0 md:p-6 md:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      style={{ backgroundColor: cardBg }}
    >
      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
        {iconBadge("w-11 h-11 rounded-full")}
        <h3
          className={`${typography.itemTitle} m-0`}
          style={{ color: titleColor, fontWeight: titleWeight }}
        >
          {card.title}
        </h3>
      </div>
      <p
        className={`${typography.itemDescription} m-0 flex-1 leading-relaxed`}
        style={{ color: descColor }}
      >
        {card.description}
      </p>
      {card.cta ? (
        <Link
          href={card.href || "#"}
          className={`${typography.button} inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium no-underline outline-none transition-[background-color,transform] active:scale-[0.98]`}
          style={{
            backgroundColor: buttonHovered
              ? getThemeColorCss(style.buttonHoverBg, "primary-800")
              : getThemeColorCss(style.buttonBg, "primary-1"),
            color: getThemeColorCss(style.buttonText, "50"),
            boxShadow: buttonFocused
              ? `0 0 0 2px ${getThemeColorCss(style.cardBg, "background")}, 0 0 0 4px ${getThemeColorCss(style.buttonFocusRing, "primary-1")}`
              : undefined,
          }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onFocus={(event) =>
            setButtonFocused(event.currentTarget.matches(":focus-visible"))
          }
          onBlur={() => setButtonFocused(false)}
        >
          {card.cta}
          <ArrowRightIcon size={16} weight="bold" className="rtl:-scale-x-100" />
        </Link>
      ) : null}
    </article>
  );
}
