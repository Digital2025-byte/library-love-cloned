"use client";

import {
  InspectorField,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];
const IMAGE_KEYS = ["backgroundImageUrl", "backgroundImageAlt"];

export default function SplitTextOnlyContentForm({
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
        idPrefix="split-text-only"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="split-text-only-image"
          label="Background image URL"
          value={content.backgroundImageUrl || ""}
          onChange={(value) => updateField("backgroundImageUrl", value)}
        />
        <InspectorField
          id="split-text-only-image-alt"
          label="Image alt"
          value={content.backgroundImageAlt || ""}
          onChange={(value) => updateField("backgroundImageAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="split-text-only-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
