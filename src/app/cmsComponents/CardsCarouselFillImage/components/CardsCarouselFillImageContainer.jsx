import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_FILL_IMAGE_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

/**
 * Full-bleed section shell. Header/nav use PageContentContainer;
 * the carousel track breaks out edge-to-edge inside the component.
 */
export default function CardsCarouselFillImageContainer({
  lang,
  dir,
  style = DEFAULT_FILL_IMAGE_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <section
      className={`w-full overflow-x-hidden ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "200") }
          : undefined
      }
    >
      <div className={paddingClass}>{children}</div>
    </section>
  );
}

export function CardsCarouselFillImageInset({ children, className = "" }) {
  return (
    <PageContentContainer className={className}>{children}</PageContentContainer>
  );
}
