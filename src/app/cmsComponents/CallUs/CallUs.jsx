"use client";

import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import CallUsIcon from "./components/CallUsIcon";
import CallUsPhone from "./components/CallUsPhone";
import { getCallUsContent } from "./utils/helpers";
import { CARD_RADIUS_CLASS, resolveCallUsStyle } from "./utils/style";

export default function CallUs({ lang = "en", data, style }) {
  const resolvedStyle = resolveCallUsStyle(style);
  const { upperText, mainText, bottomText, phoneHref, hasContent } =
    getCallUsContent(data, lang);

  if (!hasContent) {
    return null;
  }

  const radiusClass =
    CARD_RADIUS_CLASS[resolvedStyle.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const showTitle = resolvedStyle.showTitle && upperText;
  const showPhone = resolvedStyle.showPhone && mainText;
  const showDescription = resolvedStyle.showDescription && bottomText;

  return (
    <div
      className={`flex w-full flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12 lg:py-16 ${radiusClass}`}
      style={
        resolvedStyle.showCardBg
          ? {
              backgroundColor: getThemeColorCss(resolvedStyle.cardBg, "main"),
            }
          : undefined
      }
    >
      {resolvedStyle.showIcon ? (
        <CallUsIcon style={resolvedStyle} />
      ) : null}

      {showTitle ? (
        <p
          className={`${typography.body} mb-2`}
          style={{
            color: getThemeColorCss(resolvedStyle.titleColor, "white"),
          }}
        >
          {upperText}
        </p>
      ) : null}

      {showPhone ? (
        <CallUsPhone
          phoneText={mainText}
          href={phoneHref}
          style={resolvedStyle}
        />
      ) : null}

      {showDescription ? (
        <p
          className={`${typography.itemDescription} mx-auto mt-4 max-w-2xl`}
          style={{
            color: getThemeColorCss(resolvedStyle.descriptionColor, "white"),
          }}
        >
          {bottomText}
        </p>
      ) : null}
    </div>
  );
}
