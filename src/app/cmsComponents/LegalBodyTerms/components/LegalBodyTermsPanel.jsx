"use client";

import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import LegalAlert from "./LegalAlert";
import LegalBodySection from "./LegalBodySection";
import LegalChip from "./LegalChip";
import LegalContactCard from "./LegalContactCard";
import {
  DEFAULT_LEGAL_BODY_TERMS_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function LegalBodyTermsPanel({
  lang = "en",
  content,
  style = DEFAULT_LEGAL_BODY_TERMS_STYLE,
}) {
  if (!content) {
    return null;
  }

  const {
    cover,
    acceptance,
    sections = [],
    contact,
    contactTitle,
    contactDescription,
    limitationTitle,
    effectiveDateLabel,
  } = content;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const titleCss = getThemeColorCss(style.titleColor, "primary-1");
  const bodyCss = getThemeColorCss(style.bodyColor, "700");
  const chipCss = getThemeColorCss(style.chipColor, "primary-1");
  const sectionColors = { titleCss, bodyCss };

  return (
    <section className={paddingClass} dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageContentContainer>
        <div
          className="rounded-[10px] border border-200 p-6 md:p-8"
          style={{
            backgroundColor: style.showCardBg
              ? getThemeColorCss(style.cardBg, "50")
              : "transparent",
          }}
        >
          {style.showChip && cover?.effectiveDate ? (
            <div className="mb-6">
              <LegalChip label={effectiveDateLabel} colorCss={chipCss}>
                {cover.effectiveDate}
              </LegalChip>
            </div>
          ) : null}

          {style.showAcceptance && acceptance ? (
            <div className="space-y-3">
              {acceptance.title ? (
                <h3
                  className={`${typography.itemTitle} font-semibold`}
                  style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
                >
                  {acceptance.title}
                </h3>
              ) : null}
              <LegalAlert
                message={acceptance.message}
                variant="secondary"
              />
            </div>
          ) : null}

          {style.showSections && sections.length ? (
            <div className="mt-8 space-y-8">
              {sections.map((section, index) => (
                <LegalBodySection
                  key={section.title || index}
                  section={section}
                  limitationTitle={limitationTitle}
                  style={sectionColors}
                />
              ))}
            </div>
          ) : null}

          {style.showContact && contact ? (
            <div className="mt-8">
              {contactTitle || contact.title ? (
                <h3
                  className={`${typography.itemTitle} mb-2 font-semibold`}
                  style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
                >
                  {contactTitle || contact.title}
                </h3>
              ) : null}
              {contactDescription || contact.description ? (
                <p
                  className={`${typography.body} mb-4 leading-relaxed`}
                  style={{ color: bodyCss, fontWeight: getFontWeightValue(style.bodyFontWeight) }}
                >
                  {contactDescription || contact.description}
                </p>
              ) : null}
              <LegalContactCard contact={contact} lang={lang} />
            </div>
          ) : null}
        </div>
      </PageContentContainer>
    </section>
  );
}
