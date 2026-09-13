"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";

const TITLE_KEYS = ["title", "description"];
const BUTTON_KEYS = ["buttonLabel", "buttonHref", "buttonLinkType"];
const IMAGE_KEYS = ["imageUrl", "imageAlt"];

export default function CtaBannerContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorTitleSection
        idPrefix="cta-banner"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="cta-banner-button"
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

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="cta-banner-image"
          label="Image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="cta-banner-alt"
          label="Image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>
    </div>
  );
}
