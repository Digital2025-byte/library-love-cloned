"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinBacklinkSourceText,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["sectionLabel", "title", "description"];
const CTA_KEYS = ["ctaLabel", "ctaHref", "ctaLinkType"];
const IMAGE_KEYS = [
  "mainImageUrl",
  "mainImageAlt",
  "overlayImageUrl",
  "overlayImageAlt",
];
const ITEM_KEYS = ["items"];

export default function TwoColumnWithSubSectionsContentForm({
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
        idPrefix="two-column-sub-sections"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorSection title="Label" onReset={() => reset(["sectionLabel"])}>
        <InspectorField
          id="two-column-sub-sections-label"
          label="Section label"
          value={content.sectionLabel || ""}
          onChange={(value) => updateField("sectionLabel", value)}
        />
      </InspectorSection>

      <InspectorButtonSection
        idPrefix="two-column-sub-sections-cta"
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

      <InspectorSection title="Subsections" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={() => ({ title: "", description: "", links: [] })}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`two-column-sub-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`two-column-sub-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="two-column-sub-main-image"
          label="Main image URL"
          value={content.mainImageUrl || ""}
          onChange={(value) => updateField("mainImageUrl", value)}
        />
        <InspectorField
          id="two-column-sub-main-alt"
          label="Main image alt"
          value={content.mainImageAlt || ""}
          onChange={(value) => updateField("mainImageAlt", value)}
        />
        <InspectorField
          id="two-column-sub-overlay-image"
          label="Overlay image URL"
          value={content.overlayImageUrl || ""}
          onChange={(value) => updateField("overlayImageUrl", value)}
        />
        <InspectorField
          id="two-column-sub-overlay-alt"
          label="Overlay image alt"
          value={content.overlayImageAlt || ""}
          onChange={(value) => updateField("overlayImageAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="two-column-sub-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
            content.sectionLabel,
            content.title,
            content.description
          ),
          items: content.items,
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
