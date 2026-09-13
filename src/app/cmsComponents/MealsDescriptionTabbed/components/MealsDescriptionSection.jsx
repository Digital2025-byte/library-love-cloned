"use client";

import { useId } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import MealsDescriptionGroup from "./MealsDescriptionGroup";
import MealsDescriptionItem from "./MealsDescriptionItem";
import { CARD_RADIUS_CLASS, DEFAULT_MEALS_TABBED_STYLE } from "../utils/style";

export default function MealsDescriptionSection({
  section,
  sectionIndex = 0,
  isOpen = true,
  onToggle,
  links = [],
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  const reactId = useId();
  const panelId = `${reactId}-panel`;
  const headerId = `${reactId}-header`;

  if (!section) {
    return null;
  }

  const groups = Array.isArray(section.groups) ? section.groups : [];
  const items = Array.isArray(section.items) ? section.items : [];
  const hasGroups = groups.length > 0;
  const hasBody = hasGroups || items.length > 0;
  const radius =
    CARD_RADIUS_CLASS[style.accordionRadius] ??
    CARD_RADIUS_CLASS[DEFAULT_MEALS_TABBED_STYLE.accordionRadius];
  const headerBgCss = getThemeColorCss(style.headerBg, "primary-1");
  const headerTextCss = getThemeColorCss(style.headerText, "white");
  const bodyBgCss = getThemeColorCss(style.bodyBg, "100");

  return (
    <div className={`mb-3 overflow-hidden shadow-xs ${radius}`}>
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="cursor-pointer flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-start transition-colors"
        style={{
          backgroundColor: headerBgCss,
          color: headerTextCss,
        }}
      >
        <span className={`${typography.itemTitle} font-medium wrap-break-word`}>
          {section.sectionTitle || `Section ${sectionIndex + 1}`}
        </span>
        {isOpen ? (
          <CaretUpIcon size={18} weight="bold" className="shrink-0" aria-hidden />
        ) : (
          <CaretDownIcon
            size={18}
            weight="bold"
            className="shrink-0"
            aria-hidden
          />
        )}
      </button>

      {hasBody ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div style={{ backgroundColor: bodyBgCss }}>
            {hasGroups
              ? groups.map((group, groupIndex) => (
                  <MealsDescriptionGroup
                    key={`${group.title || "group"}-${groupIndex}`}
                    group={group}
                    groupIndex={groupIndex}
                    links={links}
                    style={style}
                  />
                ))
              : items.map((item, itemIndex) => (
                  <MealsDescriptionItem
                    key={`${item.title || "item"}-${itemIndex}`}
                    item={item}
                    striped={itemIndex % 2 === 1}
                    titleColor={style.itemTitleColor}
                    links={links}
                    style={style}
                  />
                ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
