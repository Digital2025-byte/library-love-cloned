"use client";

import { useId } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_FAQ_EXPLORER_STYLE, ITEM_RADIUS_CLASS } from "../utils/style";

export default function FaqAccordionItem({
  item,
  open,
  onToggle,
  style = DEFAULT_FAQ_EXPLORER_STYLE,
}) {
  const buttonId = useId();
  const panelId = useId();
  const radiusClass = ITEM_RADIUS_CLASS[style.itemRadius] ?? ITEM_RADIUS_CLASS.lg;

  return (
    <div
      className={`border border-200 ${radiusClass}`}
      style={{
        backgroundColor: style.showItemBg
          ? getThemeColorCss(style.itemBg, "background")
          : "transparent",
      }}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={`${typography.itemTitle} flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-4 text-start md:px-6 md:py-5`}
          style={{
            color: getThemeColorCss(style.questionColor, "700"),
            fontWeight: getFontWeightValue(style.questionFontWeight),
          }}
        >
          <span className="min-w-0">{item.question}</span>
          <CaretDownIcon
            size={18}
            weight="regular"
            aria-hidden
            className={`shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            style={{ color: getThemeColorCss(style.iconColor, "700") }}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {item.answer ? (
            <p
              className={`${typography.itemDescription} m-0 px-4 pb-4 leading-relaxed whitespace-pre-line md:px-6 md:pb-5`}
              style={{ color: getThemeColorCss(style.answerColor, "600") }}
            >
              {item.answer}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
