"use client";

import Image from "next/image";
import defaultPattern from "@/assets/legal/pattern.webp";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_LEGAL_INFORMATION_HERO_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function LegalInformationHeroPanel({
  lang = "en",
  title = "",
  description = "",
  links = [],
  patternUrl,
  style = DEFAULT_LEGAL_INFORMATION_HERO_STYLE,
}) {
  const patternSrc = patternUrl || defaultPattern;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.center;
  const bgStyle = style.showSectionBg
    ? style.sectionBg === DEFAULT_LEGAL_INFORMATION_HERO_STYLE.sectionBg
      ? undefined
      : {
          backgroundColor: getThemeColorCss(style.sectionBg, "main"),
          backgroundImage: "none",
        }
    : { background: "transparent" };

  return (
    <section
      className="relative h-96 w-full overflow-hidden bg-gradient-to-b from-main to-secondary-2"
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={bgStyle}
    >
      {style.showPattern ? (
        <div className="absolute inset-y-0 end-0 hidden w-1/2 opacity-50 lg:block">
          <Image
            src={patternSrc}
            alt=""
            fill
            className="object-cover object-right rtl:object-left"
            sizes="50vw"
          />
        </div>
      ) : null}

      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 ${alignClass}`}
      >
        {style.showTitle && title ? (
          <h1
            className={`${typography.pageTitle} mb-4 font-semibold`}
            style={{ color: getThemeColorCss(style.titleColor, "50"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {title}
          </h1>
        ) : null}
        {style.showDescription && description ? (
          <p
            className={`${typography.sectionDescription} max-w-4xl`}
            style={{ color: getThemeColorCss(style.descriptionColor, "50"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
              opacity: 0.9,
            }}
          >
            <LinkedText
              text={description}
              links={links}
              style={style}
              enabled={style.showLinks !== false}
            />
          </p>
        ) : null}
      </div>
    </section>
  );
}
