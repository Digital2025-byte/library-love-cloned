"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { withCampaignPath } from "@/utils/withCampaignPath";

function isUsableImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CustomCard({
  ImageUrl,
  IATACode,
  CityName,
  CountryName,
  TakeUrl,
  gradient = true,
  hoverEffect = true,
  hoverBackGround = false,
  gradientHeight = "",
  lang = "en",
  cId,
  discoverLabel,
  imageAlt,
  showImage = true,
  showCity = true,
  showIata = true,
  showCountry = true,
  showButton = true,
  showHoverDim = true,
  cardRadiusClass = "rounded-2xl shadow-lg sm:rounded-3xl",
  cityColor,
  countryColor,
  overlayColor,
  buttonBg,
  buttonText,
}) {
  const href = withCampaignPath(TakeUrl || "#", cId);
  const label =
    discoverLabel ||
    `${lang === "ar" ? "اكتشف" : "Discover"} ${CityName || ""}`.trim();
  const canShowImage = showImage && isUsableImageSrc(ImageUrl);
  const overlayCss = overlayColor
    ? getThemeColorCss(overlayColor, "secondary-2")
    : "";
  const cityCss = cityColor ? getThemeColorCss(cityColor, "50") : "";
  const countryCss = countryColor ? getThemeColorCss(countryColor, "50") : "";
  const pillCss = buttonBg ? getThemeColorCss(buttonBg, "primary-2") : "";
  const labelCss = buttonText ? getThemeColorCss(buttonText, "white") : "";
  const cityLine = [
    showCity ? CityName : "",
    showIata && IATACode ? `(${IATACode})` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const showFooter =
    cityLine || (showButton && label) || (showCountry && CountryName);

  return (
    <div className={`group relative h-full overflow-hidden ${cardRadiusClass}`}>
      <div className="relative aspect-3/4 w-full max-h-[380px] min-h-[280px]">
        {canShowImage ? (
          <Image
            src={ImageUrl}
            alt={imageAlt || (CityName ? `${CityName} destination` : "Destination")}
            fill
            className={`object-cover ${
              hoverEffect
                ? "transition-transform duration-500 group-hover:scale-105"
                : ""
            }`}
            sizes="(max-width: 1024px) 100vw, 33vw"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 bg-primary-700" aria-hidden />
        )}

        {gradient ? (
          <div
            className={`absolute bottom-0 h-[45%] w-full ${gradientHeight} ${
              overlayCss
                ? ""
                : "bg-gradient-to-t from-secondary-2/80 via-secondary-2/40 to-transparent"
            }`}
            style={
              overlayCss
                ? {
                    backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${overlayCss} 80%, transparent), color-mix(in srgb, ${overlayCss} 40%, transparent), transparent)`,
                  }
                : undefined
            }
          />
        ) : null}

        {showHoverDim ? (
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
              hoverBackGround
                ? "opacity-100"
                : "opacity-0 lg:group-hover:opacity-100"
            }`}
          />
        ) : null}
      </div>

      {showFooter ? (
        <div
          className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:bottom-10"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {cityLine ? (
            <div
              className={`${typography.itemTitle} font-semibold transition-all duration-600 opacity-0 translate-y-0 scale-100 lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:scale-70 lg:group-hover:-translate-y-20 ${
                cityCss ? "" : "text-50"
              }`}
              style={{
                textShadow: "0 4px 8px rgb(0 0 0 / 0.45)",
                color: cityCss || undefined,
              }}
            >
              {cityLine}
            </div>
          ) : null}

          <div className="absolute inset-x-4 bottom-4 flex translate-y-0 flex-col items-center justify-center opacity-100 transition-all delay-100 duration-500 sm:inset-x-5 sm:bottom-5 lg:translate-y-6 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {showButton && label ? (
              <Button
                label={label}
                href={href}
                cId={cId}
                fullWidth
                className={`justify-center px-3 py-3 shadow-md hover:opacity-100 ${
                  pillCss
                    ? ""
                    : "border-primary-2 bg-primary-2 hover:bg-primary-3"
                }`}
                style={
                  pillCss
                    ? {
                        backgroundColor: pillCss,
                        borderColor: pillCss,
                        color: labelCss || "#ffffff",
                      }
                    : undefined
                }
              />
            ) : null}
            {showCountry && CountryName ? (
              <span
                className={`${typography.caption} mt-1 flex items-center justify-center ${
                  countryCss ? "" : "text-50"
                }`}
                style={countryCss ? { color: countryCss } : undefined}
              >
                {CountryName}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
