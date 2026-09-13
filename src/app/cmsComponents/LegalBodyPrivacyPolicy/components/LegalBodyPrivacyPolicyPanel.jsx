"use client";

import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import LegalChip from "../../LegalBodyTerms/components/LegalChip";
import Introduction from "./Introduction";
import PrivacyCollectSection from "./PrivacyCollectSection";
import PrivacyContactSection from "./PrivacyContactSection";
import PrivacyRightsSection from "./PrivacyRightsSection";
import PrivacyShareSection from "./PrivacyShareSection";
import PrivacySimpleSection from "./PrivacySimpleSection";
import PrivacySummary from "./PrivacySummary";
import UsageGrid from "./UsageGrid";
import {
  DEFAULT_LEGAL_BODY_PRIVACY_POLICY_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function LegalBodyPrivacyPolicyPanel({
  lang = "en",
  content,
  style = DEFAULT_LEGAL_BODY_PRIVACY_POLICY_STYLE,
}) {
  if (!content) {
    return null;
  }

  const {
    effectiveDate,
    introduction,
    summaryPoints = [],
    sections,
    tocTitle,
    infoCollectedLabel,
    shareSituationsLabel,
  } = content;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
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
          {style.showChip && effectiveDate ? (
            <div className="mb-6">
              <LegalChip colorCss={chipCss}>{effectiveDate}</LegalChip>
            </div>
          ) : null}

          {style.showIntroduction && introduction ? (
            <Introduction title={introduction.title}>
              {introduction.content}
            </Introduction>
          ) : null}

          {style.showSummary ? (
            <PrivacySummary title={tocTitle} points={summaryPoints} />
          ) : null}

          {style.showSections ? (
            <>
              <PrivacyCollectSection
                section={sections?.whatInformationDoWeCollect}
                infoCollectedLabel={infoCollectedLabel}
              />

              {sections?.howDoWeProcessYourInformation ? (
                <PrivacySimpleSection
                  title={sections.howDoWeProcessYourInformation.title}
                  subtitle={sections.howDoWeProcessYourInformation.subtitle}
                  description={
                    sections.howDoWeProcessYourInformation.description
                  }
                >
                  <div className="mt-6">
                    <UsageGrid
                      items={sections.howDoWeProcessYourInformation.items}
                    />
                  </div>
                </PrivacySimpleSection>
              ) : null}

              <PrivacyShareSection
                section={sections?.whenAndWithWhomDoWeShare}
                shareSituationsLabel={shareSituationsLabel}
              />

              <PrivacySimpleSection
                title={sections?.doWeUseCookies?.title}
                subtitle={sections?.doWeUseCookies?.subtitle}
                description={sections?.doWeUseCookies?.description}
              />

              <PrivacySimpleSection
                title={sections?.howDoWeHandleSocialLogins?.title}
                subtitle={sections?.howDoWeHandleSocialLogins?.subtitle}
                description={
                  sections?.howDoWeHandleSocialLogins?.description
                }
              />

              <PrivacySimpleSection
                title={sections?.howLongDoWeKeepYourInformation?.title}
                subtitle={sections?.howLongDoWeKeepYourInformation?.subtitle}
                description={
                  sections?.howLongDoWeKeepYourInformation?.description
                }
              />

              <PrivacySimpleSection
                title={sections?.doWeCollectInformationFromMinors?.title}
                subtitle={
                  sections?.doWeCollectInformationFromMinors?.subtitle
                }
                description={
                  sections?.doWeCollectInformationFromMinors?.description
                }
              />

              <PrivacyRightsSection
                section={sections?.whatAreYourPrivacyRights}
              />

              <PrivacySimpleSection
                title={sections?.controlsForDoNotTrack?.title}
                description={sections?.controlsForDoNotTrack?.description}
              />

              <PrivacySimpleSection
                title={sections?.generalInformationRetention?.title}
                description={
                  sections?.generalInformationRetention?.description
                }
              />

              <PrivacySimpleSection
                title={sections?.doWeMakeUpdates?.title}
                subtitle={sections?.doWeMakeUpdates?.subtitle}
                description={sections?.doWeMakeUpdates?.description}
              />
            </>
          ) : null}

          {style.showContact ? (
            <>
              <PrivacyContactSection section={sections?.howCanYouContactUs} />

              <PrivacySimpleSection
                title={sections?.howCanYouReviewUpdateOrDelete?.title}
                description={
                  sections?.howCanYouReviewUpdateOrDelete?.description
                }
              />
            </>
          ) : null}
        </div>
      </PageContentContainer>
    </section>
  );
}
