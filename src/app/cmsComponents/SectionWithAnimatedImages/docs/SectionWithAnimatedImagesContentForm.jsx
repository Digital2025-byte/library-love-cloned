"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];
const CTA_KEYS = ["ctaLabel", "ctaHref", "ctaLinkType", "iconType"];
const IMAGE_KEYS = ["images"];

const emptyImage = () => ({ url: "", alt: "" });

export default function SectionWithAnimatedImagesContentForm({
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
        idPrefix="animated-images"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="animated-images-cta"
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

      <InspectorSection title="Icon" onReset={() => reset(["iconType"])}>
        <InspectorField
          id="animated-images-icon"
          label="Icon name"
          value={content.iconType || ""}
          onChange={(value) => updateField("iconType", value)}
        />
      </InspectorSection>

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorRepeater
          items={content.images || []}
          createItem={emptyImage}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(images) => onChange({ ...content, images })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`animated-images-${index}-url`}
                label="Image URL"
                value={item.url || ""}
                onChange={(value) => update("url", value)}
              />
              <InspectorField
                id={`animated-images-${index}-alt`}
                label="Image alt"
                value={item.alt || ""}
                onChange={(value) => update("alt", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="animated-images-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
        showReset
      />
    </div>
  );
}
