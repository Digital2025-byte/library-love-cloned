import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_FLIGHT_FARES_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function FlightFaresContainer({
  lang,
  dir,
  style = DEFAULT_FLIGHT_FARES_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <div
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "white") }
          : undefined
      }
    >
      <PageContentContainer as="section" className={`overflow-hidden ${paddingClass}`}>
        {children}
      </PageContentContainer>
    </div>
  );
}
