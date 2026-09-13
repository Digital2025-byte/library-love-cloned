import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function normalizeImage(image, fallbackAlt = "Background image") {
  if (!image) {
    return { fileUrl: "", alt: fallbackAlt };
  }

  if (typeof image === "string") {
    return { fileUrl: image, alt: fallbackAlt };
  }

  return {
    fileUrl: image.fileUrl || image.url || image.src || "",
    alt: image.alt || fallbackAlt,
  };
}

export function isUsableImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveCtaHref({ href, slug }) {
  if (href && String(href).startsWith("/")) {
    return href;
  }
  if (href && /^https?:\/\//i.test(String(href))) {
    return href;
  }
  return href || slug || "";
}

export function getHeaderWithThreeImageContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      buttonText: "",
      ctaHref: "",
      imageOne: { fileUrl: "", alt: "" },
      imageTwo: { fileUrl: "", alt: "" },
      imageThree: { fileUrl: "", alt: "" },
      mobileImageOne: { fileUrl: "", alt: "" },
      mobileImageTwo: { fileUrl: "", alt: "" },
      mobileImageThree: { fileUrl: "", alt: "" },
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
  const title = content?.title || "";
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);
  const buttonText =
    content?.ctaButton?.content ||
    content?.ctaButton?.label ||
    content?.buttonText ||
    "";
  const ctaHref = resolveCtaHref({
    href: content?.ctaButton?.href,
    slug: content?.ctaButton?.slug || content?.ctaSlug,
  });

  const imageOne = normalizeImage(
    content?.backgroundImageOne,
    "Background image one"
  );
  const imageTwo = normalizeImage(
    content?.backgroundImageTwo,
    "Background image two"
  );
  const imageThree = normalizeImage(
    content?.backgroundImageThree,
    "Background image three"
  );

  const mobileImageOne = normalizeImage(
    content?.backgroundMobileImageOne || content?.backgroundImageOne,
    imageOne.alt
  );
  const mobileImageTwo = normalizeImage(
    content?.backgroundMobileImageTwo || content?.backgroundImageTwo,
    imageTwo.alt
  );
  const mobileImageThree = normalizeImage(
    content?.backgroundMobileImageThree || content?.backgroundImageThree,
    imageThree.alt
  );

  return {
    title,
    description,
    links,
    buttonText,
    ctaHref,
    imageOne,
    imageTwo,
    imageThree,
    mobileImageOne,
    mobileImageTwo,
    mobileImageThree,
    hasContent: Boolean(
      title ||
        description ||
        buttonText ||
        imageOne.fileUrl ||
        imageTwo.fileUrl ||
        imageThree.fileUrl
    ),
  };
}

function toImageFields(image = {}, mobile = {}) {
  return {
    imageUrl: image.fileUrl || "",
    imageAlt: image.alt || "",
    mobileImageUrl: mobile.fileUrl || "",
  };
}

export function getHeaderWithThreeImageEditorContent(data, lang = "en") {
  const content = getHeaderWithThreeImageContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    buttonLabel: content.buttonText || "",
    buttonHref: content.ctaHref || "",
    buttonLinkType: "internal",
    images: [
      toImageFields(content.imageOne, content.mobileImageOne),
      toImageFields(content.imageTwo, content.mobileImageTwo),
      toImageFields(content.imageThree, content.mobileImageThree),
    ],
  };
}

function wrapImage(item = {}, fallbackAlt) {
  return {
    fileUrl: item.imageUrl || "",
    alt: item.imageAlt || fallbackAlt,
  };
}

function wrapMobileImage(item = {}, desktop) {
  return {
    fileUrl: item.mobileImageUrl || item.imageUrl || "",
    alt: item.imageAlt || desktop.alt,
  };
}

export function wrapHeaderWithThreeImageContent(content = {}, lang = "en") {
  const images = Array.isArray(content.images) ? content.images : [];
  const one = wrapImage(images[0], "Background image one");
  const two = wrapImage(images[1], "Background image two");
  const three = wrapImage(images[2], "Background image three");

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          buttonText: content.buttonLabel || "",
          ctaButton: {
            content: content.buttonLabel || "",
            label: content.buttonLabel || "",
            href: content.buttonHref || "",
            slug: content.buttonHref || "",
          },
          backgroundImageOne: one,
          backgroundImageTwo: two,
          backgroundImageThree: three,
          backgroundMobileImageOne: wrapMobileImage(images[0], one),
          backgroundMobileImageTwo: wrapMobileImage(images[1], two),
          backgroundMobileImageThree: wrapMobileImage(images[2], three),
        },
      },
    ],
  };
}
