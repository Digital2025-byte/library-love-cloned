"use client";

import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import OfficeList from "./OfficeList";
import useOfficeDirectoryTabs from "../hooks/useOfficeDirectoryTabs";
import {
  DEFAULT_OFFICE_DIRECTORY_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function OfficeDirectoryPanel({
  content,
  style = DEFAULT_OFFICE_DIRECTORY_STYLE,
}) {
  const tabs = content.tabs || [];
  const { activeIndex, setActiveIndex, onTabKeyDown, tabId, panelId, setTabRef } =
    useOfficeDirectoryTabs(tabs.length);

  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const showTabs = tabs.length > 1;
  const labels = {
    callLabel: content.callLabel,
    emailLabel: content.emailLabel,
    weekendLabel: content.weekendLabel,
  };

  if (!tabs.length) {
    return null;
  }

  return (
    <PageContentContainer as="section" className={paddingClass}>
      {showTabs ? (
        <div
          role="tablist"
          aria-label={content.tabsLabel || "Locations"}
          className="flex items-center gap-6 border-b border-200"
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${tab.label}-${index}`}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-selected={isActive}
                aria-controls={panelId(index)}
                tabIndex={isActive ? 0 : -1}
                ref={setTabRef(index)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`${typography.itemTitle} m-0 -mb-px cursor-pointer border-0 border-b border-solid bg-transparent px-0 pb-3`}
                style={{
                  color: isActive
                    ? getThemeColorCss(style.activeTabColor, "primary-1")
                    : getThemeColorCss(style.inactiveTabColor, "600"),
                  borderColor: isActive
                    ? getThemeColorCss(style.activeTabColor, "primary-1")
                    : "transparent",
                  fontWeight: getFontWeightValue(
                    isActive ? "semibold" : "medium"
                  ),
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={`${tab.label}-${index}`}
            role="tabpanel"
            id={panelId(index)}
            aria-labelledby={showTabs ? tabId(index) : undefined}
            hidden={!isActive}
            className="pt-4"
          >
            {isActive ? (
              <OfficeList
                offices={tab.offices || []}
                labels={labels}
                style={style}
              />
            ) : null}
          </div>
        );
      })}
    </PageContentContainer>
  );
}
