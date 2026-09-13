"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_SEARCH_CONSOLE_STYLE,
  PANEL_PADDING_CLASS,
  PANEL_RADIUS_CLASS,
  gradientCss,
} from "../utils/style";

export default function SearchConsolePanel({
  lang = "en",
  content,
  style = DEFAULT_SEARCH_CONSOLE_STYLE,
}) {
  const isRtl = lang === "ar";
  const paddingClass =
    PANEL_PADDING_CLASS[style.panelPadding] ?? PANEL_PADDING_CLASS.default;
  const radiusClass =
    PANEL_RADIUS_CLASS[style.panelRadius] ?? PANEL_RADIUS_CLASS.lg;
  const fromCss = getThemeColorCss(style.gradientFrom, "primary-1");
  const toCss = getThemeColorCss(style.gradientTo, "secondary-2");
  const labelCss = getThemeColorCss(style.labelColor, "50");
  const inputBgCss = getThemeColorCss(style.inputBg, "background");
  const inputTextCss = getThemeColorCss(style.inputTextColor, "700");
  const submitBgCss = getThemeColorCss(style.submitBg, "secondary");
  const submitTextCss = getThemeColorCss(style.submitTextColor, "700");
  const popularLabelCss = getThemeColorCss(style.popularLabelColor, "50");
  const chipTextCss = getThemeColorCss(style.chipTextColor, "50");
  const chipBorderCss = getThemeColorCss(style.chipBorderColor, "50");

  const showSubmit = style.showSubmit && content.submitLabel;
  const showPopular = style.showPopular && content.popularItems.length > 0;

  return (
    <div
      className={`flex w-full flex-col gap-3 ${paddingClass} ${radiusClass}`}
      style={{
        backgroundImage: gradientCss(
          fromCss,
          toCss,
          style.gradientDirection,
          isRtl
        ),
      }}
    >
      {style.showLabel && content.label ? (
        <span
          className={`${typography.itemTitle}`}
          style={{
            color: labelCss,
            fontWeight: getFontWeightValue(style.labelFontWeight),
          }}
        >
          {content.label}
        </span>
      ) : null}

      <div className="relative w-full">
        <div
          className={`flex items-center gap-3 rounded-lg ps-4 ${
            showSubmit
              ? "pe-4 py-3 md:pe-1.5 md:py-1.5"
              : "pe-4 py-3"
          }`}
          style={{ backgroundColor: inputBgCss }}
        >
          {style.showSearchIcon ? (
            <MagnifyingGlassIcon
              className="h-5 w-5 shrink-0"
              style={{ color: getThemeColorCss(style.inputTextColor, "600") }}
              aria-hidden
            />
          ) : null}
          <input
            type="text"
            className={`w-full border-none bg-transparent outline-none ${typography.body}`}
            style={{ color: inputTextCss }}
            placeholder={content.placeholder}
            readOnly
          />
          {showSubmit ? (
            <button
              type="button"
              className={`${typography.button} hidden shrink-0 cursor-pointer rounded-lg border-none px-6 py-2 transition-colors md:inline-flex`}
              style={{
                backgroundColor: submitBgCss,
                color: submitTextCss,
                fontWeight: getFontWeightValue(style.submitFontWeight),
              }}
            >
              {content.submitLabel}
            </button>
          ) : null}
        </div>
      </div>

      {showPopular ? (
        <div className="flex flex-col gap-2 pt-1 md:flex-row md:items-center md:gap-3">
          {content.popularLabel ? (
            <span
              className={`${typography.caption} whitespace-nowrap font-medium`}
              style={{ color: popularLabelCss }}
            >
              {content.popularLabel}
            </span>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            {content.popularItems.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className={`${typography.caption} whitespace-nowrap rounded-full border px-4 py-1.5`}
                style={{ color: chipTextCss, borderColor: chipBorderCss }}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
