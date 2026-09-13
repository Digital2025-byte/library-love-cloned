"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { formatFarePrice, isUsableImageSrc } from "../utils/helpers";
import { CARD_RADIUS_CLASS, DEFAULT_FLIGHT_FARES_STYLE } from "../utils/style";

export default function FlightFareCard({
  item,
  className = "",
  size,
  imageIndex = 0,
  style = DEFAULT_FLIGHT_FARES_STYLE,
  gridStyle,
}) {
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  const sizeClass =
    size === "TALL" ? "lg:row-span-2" : size === "WIDE" ? "lg:col-span-2" : "";
  const images = item?.images || [];
  const safeIndex = Math.min(imageIndex, Math.max(0, images.length - 1));
  const image = images[safeIndex] || images[0];
  const imageSrc = image?.url;
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const overlayCss = getThemeColorCss(style.overlayColor, "secondary-2");
  const titleCss = getThemeColorCss(style.itemTitleColor, "primary-3");
  const subtitleCss = getThemeColorCss(style.subtitleColor, "white");
  const badgeCss = getThemeColorCss(style.badgeColor, "secondary-2");
  const badgeTextCss = getThemeColorCss(style.badgeText, "white");
  const itemTitle = item.title || item.cityName || "";
  const subtitle =
    item.price || item.currency
      ? formatFarePrice(
          item.subtitle,
          item.price,
          item.currency,
          item.subtitle ||
            t("flightFares.economyFrom", {
              price: item.price,
              currency: item.currency,
            })
        )
      : item.subtitle || "";

  return (
    <div
      className={[
        "group relative min-w-0 overflow-hidden",
        radiusClass,
        "bg-slate-100 shadow-sm transition hover:shadow-md",
        sizeClass,
        className,
      ].join(" ")}
      style={gridStyle}
    >
      <div className="absolute inset-0">
        {style.showImage && isUsableImageSrc(imageSrc) ? (
          <Image
            src={imageSrc}
            alt={itemTitle || image?.alt || ""}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 46vw, 80vw"
          />
        ) : null}
        {style.showOverlay ? (
          <div
            className="absolute bottom-0 left-0 right-0 h-24.25 w-full shadow-[0_4px_6px_0_rgba(33,37,41,0.20),0_0_1px_0_rgba(33,37,41,0.32)] blur-2xl"
            style={{
              backgroundColor: `color-mix(in srgb, ${overlayCss} 50%, transparent)`,
            }}
          />
        ) : null}
      </div>

      {style.showTopBadge && item.hasTopBadge && item.topBadge ? (
        <div className="absolute top-3 end-3 z-10">
          <span
            className={`${typography.caption} rounded-full px-2.5 py-1 font-medium backdrop-blur`}
            style={{
              backgroundColor: `color-mix(in srgb, ${badgeCss} 25%, transparent)`,
              color: badgeTextCss,

              fontWeight: getFontWeightValue(style.badgeTextFontWeight),
            }}
          >
            {item.topBadge}
          </span>
        </div>
      ) : null}

      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        {style.showExtraBadge && item.hasExtraBadge && item.extraBadge ? (
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`${typography.caption} inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium backdrop-blur`}
              style={{
                backgroundColor: `color-mix(in srgb, ${badgeCss} 25%, transparent)`,
                color: badgeTextCss,

                fontWeight: getFontWeightValue(style.badgeTextFontWeight),
              }}
            >
              {item.extraBadge} <span aria-hidden="true">★</span>
            </span>
          </div>
        ) : null}

        {style.showItemTitle && itemTitle ? (
          <h3
            className={`${typography.itemTitle} font-bold wrap-break-word`}
            style={{
              color: titleCss,
              fontWeight: getFontWeightValue(style.itemTitleFontWeight),
            }}
          >
            {itemTitle}
          </h3>
        ) : null}
        {style.showSubtitle && subtitle ? (
          <p
            className={`${typography.itemDescription} mt-1 font-medium wrap-break-word`}
            style={{
              color: `color-mix(in srgb, ${subtitleCss} 90%, transparent)`,
              fontWeight: getFontWeightValue(style.subtitleFontWeight),
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
