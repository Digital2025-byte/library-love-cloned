import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function getFileUrl(media) {
  if (!media) {
    return "";
  }
  if (typeof media === "string") {
    return media;
  }
  return media.fileUrl || media.url || media.src || "";
}

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(String(url));
}

function normalizeSlide(raw, index, shared = {}) {
  const image =
    getFileUrl(raw?.image) ||
    getFileUrl(raw?.backgroundImage) ||
    getFileUrl(raw?.poster) ||
    getFileUrl(raw?.fileUrl) ||
    "";

  const video =
    getFileUrl(raw?.video) ||
    getFileUrl(raw?.videoUrl) ||
    (raw?.mediaType === "video" || isVideoUrl(getFileUrl(raw?.fileUrl))
      ? getFileUrl(raw?.fileUrl)
      : "") ||
    "";

  const mediaType =
    raw?.mediaType === "video" || video
      ? "video"
      : raw?.mediaType === "image" || image
        ? "image"
        : "";

  return {
    id: raw?.id || `slide-${index + 1}`,
    mediaType,
    image,
    video,
    alt: raw?.alt || raw?.imageAlt || shared.title || `Slide ${index + 1}`,
    title: raw?.title ?? shared.title ?? "",
    subtitle: raw?.subtitle ?? raw?.kicker ?? shared.subtitle ?? "",
    description: raw?.description ?? shared.description ?? "",
    links: normalizeBacklinks(raw?.links),
    buttonText:
      raw?.buttonText ||
      raw?.ctaButton?.content ||
      raw?.ctaButton?.label ||
      raw?.button ||
      shared.buttonText ||
      "",
    ctaHref:
      raw?.ctaHref ||
      raw?.ctaButton?.slug ||
      raw?.slug ||
      shared.ctaHref ||
      "",
  };
}

export function getSliderContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      links: [],
      slides: [],
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const style = data?.style || {};

  const shared = {
    title: content?.title || "",
    subtitle: content?.subtitle || content?.kicker || "",
    description: content?.description || "",
    buttonText:
      content?.buttonText ||
      content?.ctaButton?.content ||
      content?.ctaButton?.label ||
      content?.button ||
      "",
    ctaHref:
      style?.ctaButton?.slug ||
      content?.ctaButton?.slug ||
      content?.ctaHref ||
      content?.slug ||
      "",
  };

  let slidesRaw = [];

  if (Array.isArray(content?.slides) && content.slides.length) {
    slidesRaw = content.slides;
  } else if (Array.isArray(content?.images) && content.images.length) {
    slidesRaw = content.images;
  } else if (content?.backgroundImage || content?.image || content?.video) {
    slidesRaw = [
      {
        image: content.backgroundImage || content.image,
        video: content.video,
        mediaType: content.video ? "video" : "image",
        title: shared.title,
        subtitle: shared.subtitle,
        description: shared.description,
        buttonText: shared.buttonText,
        ctaHref: shared.ctaHref,
      },
    ];
  }

  const slides = slidesRaw
    .map((slide, index) => normalizeSlide(slide, index, shared))
    .filter(
      (slide) => slide.image || slide.video || slide.title || slide.description
    );

  return {
    links: normalizeBacklinks(content?.links),
    slides,
    hasContent: slides.length > 0,
  };
}

export function getSliderEditorContent(data, lang = "en") {
  const { links, slides } = getSliderContent(data, lang);

  return {
    links: toEditorBacklinks(links),
    slides: slides.map((slide) => ({
      id: slide.id,
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      links: toEditorBacklinks(slide.links),
      imageUrl: slide.image || "",
      videoUrl: slide.video || "",
      imageAlt: slide.alt || "",
      buttonText: slide.buttonText || "",
      buttonHref: slide.ctaHref || "/",
      buttonLinkType: "internal",
    })),
  };
}

export function wrapSliderContent(content = {}, lang = "en") {
  const slides = Array.isArray(content.slides) ? content.slides : [];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          links: normalizeBacklinks(content.links),
          slides: slides.map((slide, index) => ({
            id: slide?.id || `slide-${index + 1}`,
            title: slide?.title || "",
            subtitle: slide?.subtitle || "",
            description: slide?.description || "",
            links: normalizeBacklinks(slide?.links),
            alt: slide?.imageAlt || slide?.title || `Slide ${index + 1}`,
            buttonText: slide?.buttonText || "",
            ctaHref: slide?.buttonHref || "",
            mediaType: slide?.videoUrl ? "video" : "image",
            image: { fileUrl: slide?.imageUrl || "" },
            ...(slide?.videoUrl
              ? { video: { fileUrl: slide.videoUrl } }
              : {}),
          })),
        },
      },
    ],
  };
}
