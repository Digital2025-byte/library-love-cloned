import ph1 from "@/assets/header/ph1.webp";
import ph2 from "@/assets/header/ph2.webp";
import ph3 from "@/assets/header/ph3.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Hero media in order — image / video per slide.
 * Video is served from /public (Turbopack cannot import .mp4 from src/assets).
 * Extra slides cycle through this list.
 */
const SLIDER_MEDIA = [
  { type: "image", src: toUrl(ph1) },
  { type: "image", src: toUrl(ph2) },
  { type: "image", src: toUrl(ph3) },
  { type: "video", src: "/header/vid.mp4", poster: toUrl(ph1) },
];

/**
 * Builds CMS-shaped Slider data from i18next translations.
 * Slides map to ph1, ph2, ph3, then vid.mp4 as the 4th item.
 */
export function buildSliderData(t, lang = "en") {
  const slides = t("slider.slides", { returnObjects: true });
  const fallback = SLIDER_MEDIA[0];

  const buildSlide = (slide, index) => {
    const media = SLIDER_MEDIA[index % SLIDER_MEDIA.length] || fallback;
    const isVideo = media.type === "video";
    const customImage = toUrl(slide?.image);
    const customVideo = toUrl(slide?.video);

    return {
      id: slide?.id || `slide-${index + 1}`,
      title: slide?.title || "",
      subtitle: slide?.subtitle || "",
      description: slide?.description || "",
      buttonText: slide?.buttonText || t("slider.buttonText"),
      ctaHref: slide?.ctaHref || t("slider.ctaSlug"),
      alt: slide?.alt || t("slider.imageAlt"),
      mediaType: customVideo || isVideo ? "video" : "image",
      image: {
        fileUrl:
          customImage ||
          (isVideo ? media.poster || fallback.src : media.src) ||
          fallback.src,
      },
      ...(customVideo || isVideo
        ? {
            video: {
              fileUrl: customVideo || media.src,
            },
          }
        : {}),
    };
  };

  return {
    style: {
      ctaButton: {
        slug: t("slider.ctaSlug"),
      },
    },
    translations: [
      {
        languageCode: lang,
        content: {
          slides: Array.isArray(slides)
            ? slides.map(buildSlide)
            : [
                buildSlide(
                  {
                    id: "slide-1",
                    title: t("slider.title"),
                    subtitle: t("slider.subtitle"),
                    description: t("slider.description"),
                  },
                  0
                ),
              ],
        },
      },
    ],
  };
}
