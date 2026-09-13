import Link from "next/link";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import ContactCard from "./ContactCard";
import {
  CARD_GAP_CLASS,
  COLUMNS_CLASS,
  DEFAULT_CONTACT_CARDS_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function ContactCardsPanel({
  content,
  style = DEFAULT_CONTACT_CARDS_STYLE,
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;
  const columnsClass = COLUMNS_CLASS[style.columns] ?? COLUMNS_CLASS[3];
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  const showHeader =
    style.showHeader &&
    ((style.showTitle && content.title) ||
      (style.showSubtitle && content.subtitle));
  const showFooter =
    style.showFooterLink && content.footerLabel;

  return (
    <PageContentContainer as="section" className={paddingClass}>
      <div className="flex flex-col gap-4 md:gap-6">
        {showHeader ? (
          <div className={`flex flex-col gap-2 ${alignClass}`}>
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
                className={`${typography.sectionDescription} m-0`}
                style={{ color: getThemeColorCss(style.subtitleColor, "700") }}
              >
                {content.subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className={`grid grid-cols-1 ${columnsClass} ${gapClass}`}>
          {content.cards.map((card, index) => (
            <ContactCard key={`${card.title}-${index}`} card={card} style={style} />
          ))}
        </div>

        {showFooter ? (
          <div className="flex justify-center">
            <Link
              href={content.footerHref === "#" ? "#" : content.footerHref}
              className={`${typography.button} mt-0 rounded-lg border px-10 py-3 font-semibold no-underline transition-colors hover:bg-100 md:mt-4`}
              style={{
                color: getThemeColorCss(style.footerColor, "primary-1"),
                borderColor: getThemeColorCss(style.footerColor, "primary-1"),
                backgroundColor: getThemeColorCss("background", "background"),
              }}
            >
              {content.footerLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </PageContentContainer>
  );
}
