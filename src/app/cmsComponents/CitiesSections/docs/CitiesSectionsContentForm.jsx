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
const CTA_KEYS = ["ctaLabel", "ctaHref", "ctaLinkType"];
const IMAGE_KEYS = ["image1Url", "image1Alt", "image2Url", "image2Alt"];

export default function CitiesSectionsContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorTitleSection
        idPrefix="cities-sections"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="cities-sections-cta"
        heading="Button"
        label={content.ctaLabel}
        href={content.ctaHref}
        linkType={content.ctaLinkType}
        onLabelChange={(value) => updateField("ctaLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            ctaLinkType: type,
            ctaHref: href,
          })
        }
        onReset={() => reset(CTA_KEYS)}
      />

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="cities-sections-image-1"
          label="Image 1 URL"
          value={content.image1Url || ""}
          onChange={(value) => updateField("image1Url", value)}
        />
        <InspectorField
          id="cities-sections-image-1-alt"
          label="Image 1 alt"
          value={content.image1Alt || ""}
          onChange={(value) => updateField("image1Alt", value)}
        />
        <InspectorField
          id="cities-sections-image-2"
          label="Image 2 URL"
          value={content.image2Url || ""}
          onChange={(value) => updateField("image2Url", value)}
        />
        <InspectorField
          id="cities-sections-image-2-alt"
          label="Image 2 alt"
          value={content.image2Alt || ""}
          onChange={(value) => updateField("image2Alt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="cities-sections-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
        showReset
      />
    </div>
  );
}
