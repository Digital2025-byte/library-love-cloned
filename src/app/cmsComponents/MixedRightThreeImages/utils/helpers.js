import {
  getMixedThreeImagesContent,
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/MixedThreeImages/helpers";

export { getMixedThreeImagesContent as getMixedRightThreeImagesContent } from "@/app/cmsComponents/shared/MixedThreeImages/helpers";
export { isUsableImageSrc } from "@/app/cmsComponents/shared/MixedThreeImages/helpers";

export function getMixedRightThreeImagesEditorContent(data, lang = "en") {
  const content = getMixedThreeImagesContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    primaryLabel: content.primaryCta?.label || "",
    primaryHref:
      content.primaryCta?.href === "/" ? "" : content.primaryCta?.href || "",
    primaryLinkType: "internal",
    secondaryLabel: content.secondaryCta?.label || "",
    secondaryHref:
      content.secondaryCta?.href === "/" ? "" : content.secondaryCta?.href || "",
    secondaryLinkType: "internal",
    largeImageUrl: content.largeImage?.fileUrl || "",
    largeImageAlt: content.largeImage?.alt || "",
    smallImageOneUrl: content.smallImageOne?.fileUrl || "",
    smallImageOneAlt: content.smallImageOne?.alt || "",
    smallImageTwoUrl: content.smallImageTwo?.fileUrl || "",
    smallImageTwoAlt: content.smallImageTwo?.alt || "",
  };
}

export function wrapMixedRightThreeImagesContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          primaryCta: {
            label: content.primaryLabel || "",
            href: content.primaryHref || "",
          },
          secondaryCta: {
            label: content.secondaryLabel || "",
            href: content.secondaryHref || "",
          },
          images: [
            {
              fileUrl: content.largeImageUrl || "",
              alt: content.largeImageAlt || "",
            },
            {
              fileUrl: content.smallImageOneUrl || "",
              alt: content.smallImageOneAlt || "",
            },
            {
              fileUrl: content.smallImageTwoUrl || "",
              alt: content.smallImageTwoAlt || "",
            },
          ],
        },
      },
    ],
  };
}
