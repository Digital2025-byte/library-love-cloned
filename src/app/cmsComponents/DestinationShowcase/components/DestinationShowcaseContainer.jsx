import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_DESTINATION_SHOWCASE_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

/**
 * Full-bleed section shell — banner goes edge-to-edge on mobile.
 * Header stays inset via PageContentContainer in the panel.
 */
export default function DestinationShowcaseContainer({
  lang,
  dir,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <section
      className={`w-full overflow-x-hidden ${paddingClass} ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "50") }
          : undefined
      }
    >
      {children}
    </section>
  );
}
