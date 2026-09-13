import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
  HEIGHT_CLASS,
  VERTICAL_ALIGN_CLASS,
} from "../utils/style";
import HeaderWithThreeImageBackground from "./HeaderWithThreeImageBackground";
import HeaderWithThreeImageContent from "./HeaderWithThreeImageContent";

export default function HeaderWithThreeImagePanel({
  lang = "en",
  content,
  style = DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
}) {
  const overlayCss = getThemeColorCss(style.overlayColor, "main");
  const sectionBgCss = getThemeColorCss(style.sectionBg, "main");
  const heightClass =
    HEIGHT_CLASS[style.sectionHeight] ?? HEIGHT_CLASS.default;
  const verticalClass =
    VERTICAL_ALIGN_CLASS[style.verticalAlign] ?? VERTICAL_ALIGN_CLASS.center;

  const fallbackBg = style.showSectionBg
    ? sectionBgCss
    : style.showHeroImage
      ? undefined
      : overlayCss;

  return (
    <section
      className={`relative flex w-full overflow-hidden ${heightClass} ${verticalClass}`}
      style={fallbackBg ? { backgroundColor: fallbackBg } : undefined}
    >
      {style.showHeroImage ? (
        <HeaderWithThreeImageBackground
          lang={lang}
          content={content}
          style={style}
          heightClass={heightClass}
          direction={style.imageDirection}
        />
      ) : null}

      <HeaderWithThreeImageContent
        lang={lang}
        content={content}
        style={style}
      />

      {style.showOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${overlayCss} 50%, transparent), color-mix(in srgb, ${overlayCss} 50%, transparent), transparent)`,
          }}
          aria-hidden
        />
      ) : null}
    </section>
  );
}
