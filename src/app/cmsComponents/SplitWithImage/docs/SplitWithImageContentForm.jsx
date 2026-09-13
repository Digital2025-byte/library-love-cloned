"use client";

import {
  InspectorField,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];
const IMAGE_KEYS = [
  "backgroundImageUrl",
  "backgroundImageAlt",
  "imageUrl",
  "imageAlt",
];

export default function SplitWithImageContentForm({
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
        idPrefix="split-with-image"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="split-with-image-bg"
          label="Background image URL"
          value={content.backgroundImageUrl || ""}
          onChange={(value) => updateField("backgroundImageUrl", value)}
        />
        <InspectorField
          id="split-with-image-bg-alt"
          label="Background image alt"
          value={content.backgroundImageAlt || ""}
          onChange={(value) => updateField("backgroundImageAlt", value)}
        />
        <InspectorField
          id="split-with-image-fg"
          label="Foreground image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="split-with-image-fg-alt"
          label="Foreground image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="split-with-image-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
