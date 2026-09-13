"use client";

import Image from "next/image";
import { BookOpenTextIcon } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import { isUsableImageSrc } from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_SEARCH_GRID_STYLE,
} from "../utils/style";

export default function SightCard({
  card,
  bodyParts,
  lang = "en",
  posParams = "gb",
  cId,
  exploreLabel = "Explore",
  exploreMagazineLabel = "Explore as magazine",
  style = DEFAULT_SEARCH_GRID_STYLE,
}) {
  const isRtl = lang === "ar";
  const slug = String(card?.slug || "").startsWith("/")
    ? card.slug
    : `/${card?.slug || ""}`;
  const stackedHref = `/${posParams}/${lang}/sights${slug}?template=stacked`;
  const magazineHref = `/${posParams}/${lang}/sights${slug}`;
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.full;
  const overlayCss = getThemeColorCss(style.overlayColor, "900");
  const cityCss = getThemeColorCss(style.cityColor, "white");
  const nameCss = getThemeColorCss(style.nameColor, "white");
  const tagCss = getThemeColorCss(style.tagColor, "white");
  const primaryPill = getThemeColorCss(style.primaryBg, "primary-2");
  const primaryFg = getThemeColorCss(style.primaryText, "white");
  const secondaryFg = getThemeColorCss(style.secondaryText, "white");
  const canShowImage = style.showCardImage && isUsableImageSrc(card?.image);
  const showLinks = style.showLinks !== false;

  return (
    <article
      className={`group relative aspect-[4/5] w-full overflow-hidden ${radiusClass}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {canShowImage ? (
        <Image
          src={card.image}
          alt={card.name || ""}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={String(card.image).startsWith("http")}
        />
      ) : (
        <div className="absolute inset-0 bg-surface-2" aria-hidden />
      )}

      {style.showOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 top-70"
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${overlayCss} 0%, transparent) 0%, ${overlayCss} 100%)`,
          }}
          aria-hidden
        />
      ) : null}

      {style.showCity && card?.cityName ? (
        <p
          className={`${typography.body} absolute top-10 ${isRtl ? "right-5" : "left-5"} font-semibold`}
          style={{ color: cityCss, textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}
        >
          {card.cityName}
        </p>
      ) : null}

      <div
        className="absolute inset-x-5 bottom-15 flex items-end justify-between gap-3 transition-all duration-500 group-hover:translate-y-3 group-hover:opacity-0"
      >
        <div className="min-w-0 flex-1">
          {style.showName && card?.name ? (
            <h3
              className={`${typography.itemTitle} font-semibold`}
              style={{ color: nameCss, fontWeight: getFontWeightValue(style.nameFontWeight), textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}
            >
              {card.name}
            </h3>
          ) : null}
          {card?.description ? (
            <p
              className={`${typography.caption} mt-1 line-clamp-2`}
              style={{ color: nameCss, textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}
            >
              <LinkedText
                text={card.description}
                parts={bodyParts}
                style={style}
                enabled={showLinks}
              />
            </p>
          ) : null}
        </div>
        {style.showTag && card?.tag ? (
          <span
            className={`${typography.body} shrink-0 font-medium`}
            style={{ color: tagCss, textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}
          >
            {card.tag}
          </span>
        ) : null}
      </div>

      {style.showButtons ? (
        <div className="absolute inset-x-5 bottom-5 flex translate-y-4 flex-col items-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            label={exploreLabel}
            href={stackedHref}
            cId={cId}
            fullWidth
            className={`mt-2 ${typography.caption}`}
            style={{
              backgroundColor: primaryPill,
              borderColor: primaryPill,
              color: primaryFg,
              fontWeight: getFontWeightValue(style.primaryTextFontWeight),
            }}
          />
          <Button
            label={exploreMagazineLabel}
            href={magazineHref}
            cId={cId}
            icon={<BookOpenTextIcon size={20} weight="bold" aria-hidden />}
            iconPosition="start"
            variant="secondary"
            className={`mt-2 ${typography.caption}`}
            fullWidth
            style={{
              borderColor: secondaryFg,
              color: secondaryFg,
              fontWeight: getFontWeightValue(style.secondaryTextFontWeight),
            }}
          />
        </div>
      ) : null}
    </article>
  );
}
