import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_COOL_SLIDE_GALLERY_STYLE } from "../utils/style";

export default function CoolSlideGalleryContainer({
  lang,
  dir,
  style = DEFAULT_COOL_SLIDE_GALLERY_STYLE,
  children,
  className = "",
}) {
  return (
    <section
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "foreground"),
            }
          : undefined
      }
    >
      <div
        className="flex h-[560px] w-full items-center justify-center"
        style={
          style.showSectionBg
            ? {
                backgroundColor: getThemeColorCss(
                  style.sectionBg,
                  "foreground"
                ),
              }
            : undefined
        }
      >
        {children}
      </div>
    </section>
  );
}
