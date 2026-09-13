import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_MIXED_THREE_IMAGES_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function MixedRightThreeImagesContainer({
  lang,
  dir,
  style = DEFAULT_MIXED_THREE_IMAGES_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <section
      className={`w-full space-y-8 md:space-y-12 lg:space-y-14 ${paddingClass} ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "primary-800"),
            }
          : undefined
      }
    >
      {children}
    </section>
  );
}
