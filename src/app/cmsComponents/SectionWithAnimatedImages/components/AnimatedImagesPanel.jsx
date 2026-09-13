import AnimatedFallingCards from "./AnimatedFallingCards";
import AnimatedImagesContent from "./AnimatedImagesContent";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_ANIMATED_IMAGES_STYLE } from "../utils/style";

export default function AnimatedImagesPanel({
  lang = "en",
  content,
  style = DEFAULT_ANIMATED_IMAGES_STYLE,
  cId,
}) {
  const fromColor = getThemeColorCss(style.sectionBg, "primary-100");

  return (
    <section
      className="relative flex min-h-[700px] w-full flex-col overflow-hidden"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {style.showSectionBg ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${fromColor} 50%, transparent), var(--color-background))`,
          }}
        />
      ) : null}

      {style.showImages ? (
        <AnimatedFallingCards images={content.images} style={style} />
      ) : null}

      <AnimatedImagesContent
        preTitle={content.preTitle}
        title={content.title}
        links={content.links || []}
        buttonText={content.buttonText}
        buttonLink={content.buttonLink}
        iconType={content.iconType}
        cId={cId}
        style={style}
      />
    </section>
  );
}
