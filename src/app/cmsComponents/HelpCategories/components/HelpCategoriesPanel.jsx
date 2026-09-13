import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import HelpCategoryCard from "./HelpCategoryCard";
import {
  CARD_GAP_CLASS,
  COLUMNS_CLASS,
  DEFAULT_HELP_CATEGORIES_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function HelpCategoriesPanel({
  lang = "en",
  content,
  style = DEFAULT_HELP_CATEGORIES_STYLE,
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;
  const columnsClass = COLUMNS_CLASS[style.columns] ?? COLUMNS_CLASS[5];
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  const showHeader =
    style.showHeader &&
    ((style.showSectionTitle && content.title) ||
      (style.showSectionSubtitle && content.subtitle));

  return (
    <section
      className={paddingClass}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <PageContentContainer>
        <div className="flex flex-col gap-4">
          {showHeader ? (
            <div className={`flex flex-col gap-2 ${alignClass}`}>
              {style.showSectionTitle && content.title ? (
                <h2
                  className={`${typography.sectionTitle} m-0`}
                  style={{
                    color: getThemeColorCss(style.sectionTitleColor, "700"),
                    fontWeight: getFontWeightValue(
                      style.sectionTitleFontWeight
                    ),
                  }}
                >
                  {content.title}
                </h2>
              ) : null}
              {style.showSectionSubtitle && content.subtitle ? (
                <p
                  className={`${typography.sectionDescription} m-0 max-w-3xl`}
                  style={{
                    color: getThemeColorCss(style.sectionSubtitleColor, "600"),
                  }}
                >
                  {content.subtitle}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className={`grid grid-cols-1 ${columnsClass} ${gapClass}`}>
            {content.cards.map((card, index) => (
              <HelpCategoryCard
                key={`${card.title}-${index}`}
                card={card}
                style={style}
              />
            ))}
          </div>
        </div>
      </PageContentContainer>
    </section>
  );
}
