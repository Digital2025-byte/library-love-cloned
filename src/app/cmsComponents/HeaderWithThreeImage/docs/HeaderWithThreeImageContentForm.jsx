"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];
const BUTTON_KEYS = ["buttonLabel", "buttonHref", "buttonLinkType"];
const IMAGE_KEYS = ["images"];

const emptyImage = () => ({
  imageUrl: "",
  imageAlt: "",
  mobileImageUrl: "",
});

function ensureImages(images) {
  const next = Array.isArray(images) ? [...images] : [];
  while (next.length < 3) {
    next.push(emptyImage());
  }
  return next.slice(0, 3).map((item) => ({
    imageUrl: item?.imageUrl || "",
    imageAlt: item?.imageAlt || "",
    mobileImageUrl: item?.mobileImageUrl || "",
  }));
}

export default function HeaderWithThreeImageContentForm({
  content,
  onChange,
  defaults,
  imageCount = 3,
}) {
  const visibleCount = Number(imageCount) === 2 ? 2 : 3;
  const images = ensureImages(content.images).slice(0, visibleCount);
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const updateImage = (index, key, value) => {
    const next = ensureImages(content.images);
    next[index] = { ...next[index], [key]: value };
    onChange({ ...content, images: next });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorTitleSection
        idPrefix="header-three-image"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="header-three-image-button"
        label={content.buttonLabel}
        href={content.buttonHref}
        linkType={content.buttonLinkType}
        onLabelChange={(value) => updateField("buttonLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            buttonLinkType: type,
            buttonHref: href,
          })
        }
        onReset={() => reset(BUTTON_KEYS)}
      />

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        {images.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <InspectorField
              id={`header-three-image-${index}-url`}
              label={`Image ${index + 1} URL`}
              value={item.imageUrl}
              onChange={(value) => updateImage(index, "imageUrl", value)}
            />
            <InspectorField
              id={`header-three-image-${index}-mobile`}
              label={`Image ${index + 1} mobile URL`}
              value={item.mobileImageUrl}
              onChange={(value) => updateImage(index, "mobileImageUrl", value)}
            />
            <InspectorField
              id={`header-three-image-${index}-alt`}
              label={`Image ${index + 1} alt`}
              value={item.imageAlt}
              onChange={(value) => updateImage(index, "imageAlt", value)}
            />
          </div>
        ))}
      </InspectorSection>

      <BacklinksEditor
        idPrefix="header-three-image-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
