"use client";

import { useEffect, useState } from "react";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import FormCard from "./FormCard";
import {
  CARD_GAP_CLASS,
  COLUMNS_CLASS,
  DEFAULT_FORMS_DIRECTORY_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function FormsDirectoryPanel({
  content,
  style = DEFAULT_FORMS_DIRECTORY_STYLE,
}) {
  const tabs = content.tabs || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= tabs.length) {
      setActiveIndex(0);
    }
  }, [tabs.length, activeIndex]);

  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;
  const columnsClass = COLUMNS_CLASS[style.columns] ?? COLUMNS_CLASS[3];
  const activeTab = tabs[activeIndex] || tabs[0];
  const showTabs = tabs.length > 1;

  return (
    <PageContentContainer as="section" className={paddingClass}>
      <div className="flex flex-col gap-4 md:gap-6">
        {showTabs ? (
          <div role="tablist" className="flex w-full gap-2 md:gap-3">
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${tab.label}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`${typography.caption} m-0 box-border shrink grow basis-0 cursor-pointer whitespace-normal rounded-lg border-none px-2 py-2.5 text-center font-medium sm:px-3 sm:py-3 md:px-4`}
                  style={{
                    backgroundColor: isActive
                      ? getThemeColorCss(style.tabActiveBg, "primary-1")
                      : getThemeColorCss(style.tabInactiveBg, "200"),
                    color: isActive
                      ? getThemeColorCss(style.tabActiveText, "50")
                      : getThemeColorCss(style.tabInactiveText, "700"),
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {style.showTitle && activeTab?.label ? (
          <h2
            className={`${typography.sectionTitle} m-0`}
            style={{
              color: getThemeColorCss(style.titleColor, "primary-1"),
              fontWeight: getFontWeightValue(style.titleFontWeight),
            }}
          >
            {activeTab.label}
          </h2>
        ) : null}

        {activeTab ? (
          <div className={`grid grid-cols-1 ${columnsClass} ${gapClass}`}>
            {(activeTab.cards || []).map((card, index) => (
              <FormCard key={`${card.title}-${index}`} card={card} style={style} />
            ))}
          </div>
        ) : null}
      </div>
    </PageContentContainer>
  );
}
