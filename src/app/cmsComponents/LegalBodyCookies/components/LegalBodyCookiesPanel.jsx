"use client";

import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import LegalChip from "../../LegalBodyTerms/components/LegalChip";
import LegalContactCard from "../../LegalBodyTerms/components/LegalContactCard";
import LegalCardInfo from "../../LegalBodyTerms/components/LegalCardInfo";
import LegalCookiesIntroduction from "./LegalCookiesIntroduction";
import LifespanSection from "./LifespanSection";
import ManagePreferences from "./ManagePreferences";
import ThirdPartyCookies from "./ThirdPartyCookies";
import {
  DEFAULT_LEGAL_BODY_COOKIES_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function LegalBodyCookiesPanel({
  lang = "en",
  content,
  style = DEFAULT_LEGAL_BODY_COOKIES_STYLE,
}) {
  if (!content) {
    return null;
  }

  const {
    cover,
    introduction,
    typesTitle,
    types = [],
    thirdParty,
    preferences,
    lifespan,
    updates,
    contact,
  } = content;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const titleCss = getThemeColorCss(style.titleColor, "primary-1");
  const bodyCss = getThemeColorCss(style.bodyColor, "700");
  const chipCss = getThemeColorCss(style.chipColor, "primary-1");

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
              <LegalChip colorCss={chipCss}>{cover.effectiveDate}</LegalChip>
            </div>
          ) : null}

          {style.showIntroduction && introduction ? (
            <LegalCookiesIntroduction title={introduction.title}>
              {introduction.content}
            </LegalCookiesIntroduction>
          ) : null}

          {style.showTypes && types.length ? (
            <div className="mb-6">
              <h2
                className={`${typography.sectionTitle} mb-4 font-semibold`}
                style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
              >
                {typesTitle || "Types of Cookies We Use"}
              </h2>
              <div className="space-y-4">
                {types.map((item, index) => (
                  <LegalCardInfo
                    key={item.title || index}
                    title={item.title}
                    description={item.description}
                    titleCss={titleCss}
                    bodyCss={bodyCss}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {style.showThirdParty ? (
            <ThirdPartyCookies
              title={thirdParty?.title}
              description={thirdParty?.description}
              providers={thirdParty?.providers}
            />
          ) : null}

          {style.showPreferences ? (
            <ManagePreferences
              title={preferences?.title}
              intro={preferences?.intro}
              methods={preferences?.methods}
              note={preferences?.note}
            />
          ) : null}

          {style.showLifespan ? (
            <LifespanSection
              title={lifespan?.title}
              intro={lifespan?.intro}
              items={lifespan?.items}
            />
          ) : null}

          {(style.showUpdates && updates) || (style.showContact && contact) ? (
            <div className="mt-8">
              {style.showUpdates && updates ? (
                <>
                  {updates.title ? (
                    <h3
                      className={`${typography.itemTitle} mb-2 font-semibold`}
                      style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
                    >
                      {updates.title}
                    </h3>
                  ) : null}
                  {updates.description ? (
                    <p
                      className={`${typography.body} mb-4 leading-relaxed`}
                      style={{ color: bodyCss, fontWeight: getFontWeightValue(style.bodyFontWeight) }}
                    >
                      {updates.description}
                    </p>
                  ) : null}
                </>
              ) : null}
              {style.showContact && contact ? (
                <LegalContactCard contact={contact} lang={lang} />
              ) : null}
            </div>
          ) : null}
        </div>
      </PageContentContainer>
    </section>
  );
}
