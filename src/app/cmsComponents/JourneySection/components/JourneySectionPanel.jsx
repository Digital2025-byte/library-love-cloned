import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import JourneyStep from "./JourneyStep";
import {
  COLUMNS_CLASS,
  COLUMN_GAP_CLASS,
  DEFAULT_JOURNEY_SECTION_STYLE,
  PANEL_PADDING_CLASS,
  PANEL_RADIUS_CLASS,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function JourneySectionPanel({
  lang = "en",
  content,
  style = DEFAULT_JOURNEY_SECTION_STYLE,
}) {
  const sectionPaddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const panelPaddingClass = style.showPanelBg
    ? PANEL_PADDING_CLASS[style.panelPadding] ?? PANEL_PADDING_CLASS.default
    : "";
  const panelRadiusClass = style.showPanelBg
    ? PANEL_RADIUS_CLASS[style.panelRadius] ?? PANEL_RADIUS_CLASS.lg
    : "";
  const columnsClass = COLUMNS_CLASS[style.columns] ?? COLUMNS_CLASS[4];
  const gapClass =
    COLUMN_GAP_CLASS[style.columnGap] ?? COLUMN_GAP_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  const showHeader =
    style.showHeader &&
    ((style.showTitle && content.title) ||
      (style.showSubtitle && content.subtitle));

  return (
    <section className={sectionPaddingClass} dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageContentContainer>
        <div
          className={`${panelPaddingClass} ${panelRadiusClass}`.trim()}
          style={
            style.showPanelBg
              ? { backgroundColor: getThemeColorCss(style.panelBg, "background") }
              : undefined
          }
        >
          {showHeader ? (
            <div className={`mb-6 flex flex-col gap-2 md:mb-7 ${alignClass}`}>
              {style.showTitle && content.title ? (
                <h2
                  className={`${typography.sectionTitle} m-0`}
                  style={{
                    color: getThemeColorCss(style.titleColor, "700"),
                    fontWeight: getFontWeightValue(style.titleFontWeight),
                  }}
                >
                  {content.title}
                </h2>
              ) : null}
              {style.showSubtitle && content.subtitle ? (
                <p
                  className={`${typography.sectionDescription} m-0 max-w-4xl`}
                  style={{ color: getThemeColorCss(style.subtitleColor, "600") }}
                >
                  {content.subtitle}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className={`grid grid-cols-1 ${columnsClass} ${gapClass}`}>
            {content.steps.map((step, index) => (
              <JourneyStep
                key={`${step.title}-${index}`}
                step={step}
                style={style}
              />
            ))}
          </div>
        </div>
      </PageContentContainer>
    </section>
  );
}
