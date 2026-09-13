"use client";

import Image from "next/image";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_FORM_FOOTER_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function FormFooterPanel({
  lang = "en",
  followTitle = "",
  followDescription = "",
  contactTitle = "",
  email = "",
  website = "",
  copyright = "",
  phone = "",
  phoneHref = "",
  socialLinks = [],
  style = DEFAULT_FORM_FOOTER_STYLE,
}) {
  const websiteLabel = String(website || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const titleCss = getThemeColorCss(style.titleColor, "50");
  const copyCss = getThemeColorCss(style.descriptionColor, "50");
  const linkCss = getThemeColorCss(style.linkColor, "50");
  const barBg = style.showSectionBg
    ? getThemeColorCss(style.sectionBg, "main")
    : "transparent";

  return (
    <footer dir={lang === "ar" ? "rtl" : "ltr"} className="w-full">
      <div className={`px-4 ${paddingClass}`} style={{ backgroundColor: barBg, color: copyCss }}>
        <PageContentContainer className="mx-auto max-w-[600px]">
          <div className="flex flex-col gap-4 md:flex-row">
            {style.showFollow ? (
              <div className="min-w-[200px] flex-1 px-2">
                {followTitle ? (
                  <div
                    className={`${typography.itemTitle} mb-1 font-semibold`}
                    style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
                  >
                    {followTitle}
                  </div>
                ) : null}
                {style.showDescription && followDescription ? (
                  <p
                    className={`${typography.caption} leading-5`}
                    style={{ color: copyCss, fontWeight: getFontWeightValue(style.copyFontWeight) }}
                  >
                    {followDescription}
                  </p>
                ) : null}
                {style.showSocial && socialLinks.length ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {socialLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          alt={item.alt || ""}
                          src={item.src}
                          width={24}
                          height={24}
                        />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {style.showContact ? (
              <div className="min-w-[200px] flex-1 px-2">
                {contactTitle ? (
                  <div
                    className={`${typography.itemTitle} mb-1 font-semibold`}
                    style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
                  >
                    {contactTitle}
                  </div>
                ) : null}
                <div className={`${typography.caption} leading-5`}>
                  {phone ? (
                    <div>
                      <a
                        href={phoneHref || `tel:${phone}`}
                        style={{ color: linkCss }}
                      >
                        {phone}
                      </a>
                    </div>
                  ) : null}
                  {email ? (
                    <div>
                      <a
                        href={`mailto:${email}`}
                        className="underline"
                        style={{ color: linkCss }}
                      >
                        {email}
                      </a>
                    </div>
                  ) : null}
                  {website ? (
                    <div>
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                        style={{ color: linkCss }}
                      >
                        {websiteLabel}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </PageContentContainer>
      </div>

      {style.showCopyright && copyright ? (
        <div className="px-4 py-2">
          <PageContentContainer className="mx-auto max-w-[600px] text-center">
            <strong
              className={typography.caption}
              style={{ color: getThemeColorCss(style.copyrightColor, "main") }}
            >
              {copyright}
            </strong>
          </PageContentContainer>
        </div>
      ) : null}
    </footer>
  );
}
