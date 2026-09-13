"use client";

import { useEffect, useState } from "react";
import PageContentContainer from "@/components/layout/PageContentContainer";
import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import FaqAccordionItem from "./FaqAccordionItem";
import {
  DEFAULT_FAQ_EXPLORER_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function FaqExplorerPanel({
  content,
  style = DEFAULT_FAQ_EXPLORER_STYLE,
}) {
  const categories = content.categories || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    if (activeIndex >= categories.length) {
      setActiveIndex(0);
    }
  }, [categories.length, activeIndex]);

  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const activeCategory = categories[activeIndex] || categories[0];
  const showTabs = categories.length > 1;

  return (
    <PageContentContainer as="section" className={paddingClass}>
      <div className="flex flex-col gap-4 md:gap-6">
        {style.showTitle && content.title ? (
          <div className={`flex flex-col ${alignClass}`}>
            <h2
              className={`${typography.sectionTitle} m-0`}
              style={{
                color: getThemeColorCss(style.titleColor, "700"),
                fontWeight: getFontWeightValue(style.titleFontWeight),
              }}
            >
              {content.title}
            </h2>
          </div>
        ) : null}

        {showTabs ? (
          <div
            role="tablist"
            className="flex flex-wrap items-center gap-2 md:gap-3"
          >
            {categories.map((cat, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${cat.label}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveIndex(index);
                    setOpenKey(null);
                  }}
                  className={`${typography.caption} cursor-pointer rounded-full border px-4 py-1.5 transition-colors`}
                  style={{
                    color: isActive
                      ? getThemeColorCss(style.activeTabColor, "primary-1")
                      : getThemeColorCss(style.inactiveTabColor, "600"),
                    borderColor: isActive
                      ? getThemeColorCss(style.activeTabColor, "primary-1")
                      : getThemeColorCss("200", "200"),
                    fontWeight: getFontWeightValue(
                      isActive ? "semibold" : "medium"
                    ),
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {activeCategory ? (
          <div className="flex flex-col gap-3 md:gap-4">
            {(activeCategory.questions || []).map((item, index) => {
              const key = `${activeIndex}-${index}`;
              return (
                <FaqAccordionItem
                  key={key}
                  item={item}
                  open={openKey === key}
                  onToggle={() =>
                    setOpenKey((current) => (current === key ? null : key))
                  }
                  style={style}
                />
              );
            })}
          </div>
        ) : null}

        {style.showBrowse && content.browseLabel ? (
          <div className="flex justify-center pt-1 md:pt-2">
            <Button
              label={content.browseLabel}
              href={content.browseHref === "#" ? undefined : content.browseHref}
              style={{
                backgroundColor: getThemeColorCss(style.browseBg, "secondary"),
                borderColor: getThemeColorCss(style.browseBg, "secondary"),
                color: getThemeColorCss(style.browseText, "btn"),
              }}
            />
          </div>
        ) : null}
      </div>
    </PageContentContainer>
  );
}
