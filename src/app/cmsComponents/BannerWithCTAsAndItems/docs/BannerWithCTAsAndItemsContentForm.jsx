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

const TITLE_KEYS = ["title", "description"];
const PRIMARY_KEYS = ["primaryLabel", "primaryHref", "primaryLinkType"];
const SECONDARY_KEYS = [
  "secondaryLabel",
  "secondaryHref",
  "secondaryLinkType",
];
const IMAGE_KEYS = ["imageUrl", "imageAlt"];
const ITEM_KEYS = ["items"];

export default function BannerWithCTAsAndItemsContentForm({
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
        idPrefix="banner-ctas-items"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="banner-ctas-primary"
        heading="Primary"
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
        idPrefix="banner-ctas-secondary"
        heading="Secondary"
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

      <InspectorSection title="Items" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={() => ({ text: "", links: [] })}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`banner-ctas-item-${index}`}
                label="Text"
                value={item.text || ""}
                onChange={(value) => update("text", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="banner-ctas-image"
          label="Image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="banner-ctas-alt"
          label="Image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="banner-ctas-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
            content.title,
            content.description
          ),
          items: (content.items || []).map((item) => ({
            description: item.text,
          })),
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
