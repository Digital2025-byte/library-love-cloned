import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_LEGAL_INFORMATION_CARDS_STYLE } from "../utils/style";

export default function LegalInformationCardsContainer({
  lang,
  dir,
  style = DEFAULT_LEGAL_INFORMATION_CARDS_STYLE,
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "white"),
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
