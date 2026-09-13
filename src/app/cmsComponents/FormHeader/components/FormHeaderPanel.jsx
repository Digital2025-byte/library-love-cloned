"use client";

import Image from "next/image";
import Link from "next/link";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_HEADER_IMAGE,
  DEFAULT_PROMO_HREF,
  DEFAULT_PROMO_IMAGE,
} from "../utils/constants";
import {
  DEFAULT_FORM_HEADER_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function FormHeaderPanel({
  lang = "en",
  posParams = "gb",
  title = "",
  subtitle = "",
  ctaLabel = "",
  headerImageSrc = "",
  promoImageSrc = "",
  promoHref = "",
  promoAlt = "",
  isTransportationSurvey = false,
  style = DEFAULT_FORM_HEADER_STYLE,
  children,
}) {
  const homeHref = `/${posParams}/${lang}`;
  const bannerSrc = headerImageSrc || DEFAULT_HEADER_IMAGE;
  const promoSrc = promoImageSrc || DEFAULT_PROMO_IMAGE;
  const promoLink = promoHref || DEFAULT_PROMO_HREF;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.center;
  const showPromo = style.showPromo && !isTransportationSurvey && promoSrc;

  return (
    <section dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageContentContainer className={`mx-auto max-w-[600px] ${paddingClass}`}>
        {style.showBanner ? (
          <Link href={homeHref} className="block pt-2">
            <Image
              src={bannerSrc}
              alt={title || "FlyCham"}
              width={1200}
              height={400}
              className="h-auto w-full"
              sizes="(max-width: 600px) 100vw, 600px"
            />
          </Link>
        ) : null}

        {showPromo ? (
          <div className="pb-4 pt-3">
            <a href={promoLink} target="_blank" rel="noreferrer">
              <Image
                src={promoSrc}
                alt={promoAlt || ""}
                width={1200}
                height={400}
                className="h-auto w-full rounded-md"
                sizes="(max-width: 600px) 100vw, 600px"
              />
            </a>
          </div>
        ) : null}

        {style.showTitle || style.showDescription ? (
          <div className={`px-2 pb-2 pt-3 ${alignClass}`}>
            {style.showTitle && title ? (
              <strong
                className={`${typography.itemTitle} block font-semibold`}
                style={{ color: getThemeColorCss(style.titleColor, "main"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
              >
                {title}
              </strong>
            ) : null}
            {style.showDescription && subtitle ? (
              <p
                className={`${typography.body} pt-1`}
                style={{ color: getThemeColorCss(style.descriptionColor, "main"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        {children}

        {style.showCta && ctaLabel ? (
          <div
            className={`${typography.button} px-4 py-3 text-center font-semibold`}
            style={{
              backgroundColor: getThemeColorCss(style.ctaBg, "primary-1"),
              color: getThemeColorCss(style.ctaText, "50"),
            }}
          >
            {ctaLabel}
          </div>
        ) : null}
      </PageContentContainer>
    </section>
  );
}
