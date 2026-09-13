"use client";

import { useState } from "react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { isUsableImageSrc } from "../utils/helpers";

export default function OurValuesDesktop({
  lang = "en",
  items = [],
  itemLinkParts = null,
  style,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) {
    return null;
  }

  const overlayCss = getThemeColorCss(style.overlayColor, "secondary-2");
  const panelCss = getThemeColorCss(style.panelColor, "main");
  const openOnHover = style.openOn === "hover";

  return (
    <div
      className="flex gap-0 overflow-hidden"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const otherIndexes = items
          .map((_, i) => i)
          .filter((i) => i !== activeIndex);
        const nonActiveOrder = otherIndexes.indexOf(index);
        const canShowImage = isUsableImageSrc(item.imageUrl);

        const flexClass = isActive
          ? "flex-[3]"
          : nonActiveOrder === 0
            ? "flex-[1.1]"
            : "flex-[1.6]";

        return (
          <div
            key={`${item.title}-${index}`}
            onClick={() => setActiveIndex(index)}
            onMouseEnter={
              openOnHover ? () => setActiveIndex(index) : undefined
            }
            className={`relative mt-4 h-[90vh] flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-700 ${flexClass}`}
          >
            {canShowImage ? (
              <img
                src={item.imageUrl}
                alt={item.imageAlt || item.title || ""}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                  isActive || !style.grayscaleInactive ? "grayscale-0" : "grayscale"
                }`}
              />
            ) : style.showOverlay ? (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: overlayCss }}
                aria-hidden
              />
            ) : (
              <div className="absolute inset-0 bg-black/20" aria-hidden />
            )}

            {style.showOverlay ? (
              <div
                className="absolute inset-0 z-10"
                style={{
                  backgroundColor: `color-mix(in srgb, ${overlayCss} 10%, transparent)`,
                }}
              />
            ) : null}

            {isActive && style.showItemTitle && item.title ? (
              <div className="absolute top-10 z-20 m-3 rounded-xl p-3 opacity-90 transition-opacity duration-500">
                <h3
                  className={`${typography.itemTitle} font-bold`}
                  style={{ color: getThemeColorCss(style.itemTitleColor, "white"), fontWeight: getFontWeightValue(style.itemTitleFontWeight),
                    textShadow: "0 4px 8px rgb(0 0 0 / 0.45)",
                  }}
                >
                  <LinkedText
                    text={item.title}
                    parts={itemLinkParts?.[index]?.titleParts}
                    links={item.links}
                    style={style}
                    enabled={style.showLinks !== false}
                  />
                </h3>
              </div>
            ) : null}

            <div
              className={`absolute bottom-20 z-20 m-3 ml-12 max-w-lg rounded-[10px] px-8 py-4 backdrop-blur-[20px] transition-opacity ${
                isActive && style.showItemDescription && item.description
                  ? "opacity-100 delay-300 duration-600"
                  : "pointer-events-none opacity-0 duration-100"
              }`}
              style={
                style.showPanelBg
                  ? {
                      backgroundColor: `color-mix(in srgb, ${panelCss} 50%, transparent)`,
                    }
                  : undefined
              }
            >
              <p
                className={`${typography.body} text-start leading-relaxed`}
                style={{ color: getThemeColorCss(style.itemBodyColor, "white") }}
              >
                <LinkedText
                  text={item.description}
                  parts={itemLinkParts?.[index]?.bodyParts}
                  links={item.links}
                  style={style}
                  enabled={style.showLinks !== false}
                />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
