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
const PRIMARY_KEYS = ["primaryLabel", "primaryHref", "primaryLinkType"];
const SECONDARY_KEYS = ["secondaryLabel", "secondaryHref", "secondaryLinkType"];
const IMAGE_KEYS = [
  "largeImageUrl",
  "largeImageAlt",
  "smallImageOneUrl",
  "smallImageOneAlt",
  "smallImageTwoUrl",
  "smallImageTwoAlt",
];

export default function MixedRightThreeImagesContentForm({
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
        idPrefix="mixed-three-images"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="mixed-three-images-primary"
        heading="Primary button"
        label={content.primaryLabel}
        href={content.primaryHref}
        linkType={content.primaryLinkType}
        onLabelChange={(value) => updateField("primaryLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            primaryLinkType: type,
            primaryHref: href,
          })
        }
        onReset={() => reset(PRIMARY_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="mixed-three-images-secondary"
        heading="Secondary button"
        label={content.secondaryLabel}
        href={content.secondaryHref}
        linkType={content.secondaryLinkType}
        onLabelChange={(value) => updateField("secondaryLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            secondaryLinkType: type,
            secondaryHref: href,
          })
        }
        onReset={() => reset(SECONDARY_KEYS)}
      />

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="mixed-three-images-large"
          label="Large image URL"
          value={content.largeImageUrl || ""}
          onChange={(value) => updateField("largeImageUrl", value)}
        />
        <InspectorField
          id="mixed-three-images-large-alt"
          label="Large image alt"
          value={content.largeImageAlt || ""}
          onChange={(value) => updateField("largeImageAlt", value)}
        />
        <InspectorField
          id="mixed-three-images-small-one"
          label="Small image 1 URL"
          value={content.smallImageOneUrl || ""}
          onChange={(value) => updateField("smallImageOneUrl", value)}
        />
        <InspectorField
          id="mixed-three-images-small-one-alt"
          label="Small image 1 alt"
          value={content.smallImageOneAlt || ""}
          onChange={(value) => updateField("smallImageOneAlt", value)}
        />
        <InspectorField
          id="mixed-three-images-small-two"
          label="Small image 2 URL"
          value={content.smallImageTwoUrl || ""}
          onChange={(value) => updateField("smallImageTwoUrl", value)}
        />
        <InspectorField
          id="mixed-three-images-small-two-alt"
          label="Small image 2 alt"
          value={content.smallImageTwoAlt || ""}
          onChange={(value) => updateField("smallImageTwoAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="mixed-three-images-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
        showReset
      />
    </div>
  );
}
