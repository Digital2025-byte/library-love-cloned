"use client";

import { useState } from "react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_TRACK_REQUEST_STYLE } from "../utils/style";

/**
 * Floating-label field, matching the source shared Input (text variant):
 * bordered box, label rests inside and animates up + turns primary on
 * focus / when filled.
 */
function Field({ id, label, value, onChange, dir }) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type="text"
        dir={dir}
        placeholder=" "
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`peer block h-14 w-full rounded-md border border-200 bg-background px-3 pt-6 pb-2 sm:px-4 ${typography.body} text-600 placeholder-transparent focus:!border-primary-1 focus:outline-none focus:ring-0 md:h-auto`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute top-0 start-0 w-full origin-top-left overflow-hidden px-4 pt-4.5 text-ellipsis whitespace-nowrap text-600 transition duration-100 ease-in-out rtl:origin-top-right ${typography.body} peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-primary-1 peer-not-placeholder-shown:-translate-y-2 peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:text-primary-1`}
      >
        {label}
      </label>
    </div>
  );
}

export default function TrackRequestPanel({
  content,
  style = DEFAULT_TRACK_REQUEST_STYLE,
}) {
  const [caseNumber, setCaseNumber] = useState("");
  const [lastName, setLastName] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    // No backend yet — surface the values for wiring later.
    console.log("TrackRequest submit", { caseNumber, lastName });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {(style.showTitle && content.title) ||
      (style.showSubtitle && content.subtitle) ? (
        <div className="flex flex-col gap-1">
          {style.showTitle && content.title ? (
            <h2
              className={`${typography.sectionTitle} m-0`}
              style={{
                color: getThemeColorCss(style.titleColor, "700"),
                fontWeight: getFontWeightValue(style.titleFontWeight),
              }}
            >
              {content.title}
            </h2>
          ) : null}
          {style.showSubtitle && content.subtitle ? (
            <p
              className={`${typography.sectionDescription} m-0`}
              style={{ color: getThemeColorCss(style.subtitleColor, "600") }}
            >
              {content.subtitle}
            </p>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <Field
            id="track-request-case"
            label={content.caseNumberLabel}
            value={caseNumber}
            onChange={setCaseNumber}
            dir="ltr"
          />
          <Field
            id="track-request-lastname"
            label={content.lastNameLabel}
            value={lastName}
            onChange={setLastName}
          />
        </div>
        {content.submitLabel ? (
          <button
            type="submit"
            className={`${typography.button} w-fit cursor-pointer rounded-lg border-none px-6 py-3 transition-colors`}
            style={{
              backgroundColor: getThemeColorCss(style.buttonBg, "primary-1"),
              color: getThemeColorCss(style.buttonText, "50"),
              fontWeight: getFontWeightValue(style.buttonFontWeight),
            }}
          >
            {content.submitLabel}
          </button>
        ) : null}
      </form>
    </div>
  );
}
