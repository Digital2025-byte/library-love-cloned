"use client";

import { useId } from "react";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { useMealsDescriptionTabbed } from "../hooks/useMealsDescriptionTabbed";
import MealsDescriptionImage from "./MealsDescriptionImage";
import MealsDescriptionSections from "./MealsDescriptionSections";
import MealsDescriptionTabs from "./MealsDescriptionTabs";
import {
  DEFAULT_MEALS_TABBED_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function MealsDescriptionTabbedPanel({
  lang = "en",
  content,
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  const baseId = useId();
  const isRtl = lang === "ar";
  const {
    activeTabIndex,
    setActiveTabIndex,
    activeTab,
    activeSections,
    isSectionOpen,
    toggleSection,
  } = useMealsDescriptionTabbed(content.tabs);
  const panelId = `${baseId}-panel-${activeTabIndex}`;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const showHeading = style.showTitle && content.title;

  return (
    <section
      className={`w-full ${paddingClass}`}
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby={showHeading ? `${baseId}-title` : undefined}
      style={
        style.showSectionBg
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "white") }
          : undefined
      }
    >
      <PageContentContainer>
        {showHeading ? (
          <h2
            id={`${baseId}-title`}
            className={`${typography.sectionTitle} mb-5 font-semibold wrap-break-word ${alignClass}`}
            style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {content.title}
          </h2>
        ) : null}

        {style.showTabs ? (
          <MealsDescriptionTabs
            tabs={content.tabs}
            activeTabIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
            idPrefix={baseId}
            isRtl={isRtl}
            style={style}
          />
        ) : null}

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <MealsDescriptionSections
            sections={activeSections}
            notes={style.showNotes ? content.notes : []}
            links={content.links || []}
            isSectionOpen={isSectionOpen}
            onToggleSection={toggleSection}
            panelId={panelId}
            labelledBy={`${baseId}-tab-${activeTabIndex}`}
            wide={!style.showImage}
            style={style}
          />
          {style.showImage ? (
            <MealsDescriptionImage
              image={activeTab?.image}
              tabKey={`tab-${activeTabIndex}`}
              style={style}
            />
          ) : null}
        </div>
      </PageContentContainer>
    </section>
  );
}
