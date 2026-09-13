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
const IMAGE_KEYS = [
  "mainImageUrl",
  "mainImageAlt",
  "overlayImageUrl",
  "overlayImageAlt",
];

export default function TwoColumnIntroWithTwoImageContentForm({
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
        idPrefix="two-column-intro"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="two-column-intro-cta"
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
          id="two-column-intro-main"
          label="Main image URL"
          value={content.mainImageUrl || ""}
          onChange={(value) => updateField("mainImageUrl", value)}
        />
        <InspectorField
          id="two-column-intro-main-alt"
          label="Main image alt"
          value={content.mainImageAlt || ""}
          onChange={(value) => updateField("mainImageAlt", value)}
        />
        <InspectorField
          id="two-column-intro-overlay"
          label="Overlay image URL"
          value={content.overlayImageUrl || ""}
          onChange={(value) => updateField("overlayImageUrl", value)}
        />
        <InspectorField
          id="two-column-intro-overlay-alt"
          label="Overlay image alt"
          value={content.overlayImageAlt || ""}
          onChange={(value) => updateField("overlayImageAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="two-column-intro-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
