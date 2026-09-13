"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinBacklinkSourceText,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";

const FIRST_KEYS = [
  "firstSectionTitle",
  "firstSectionDescription",
  "firstSectionLinks",
  "firstSectionImageUrl",
  "firstSectionImageAlt",
];
const EXPLORE_KEYS = ["exploreLabel", "exploreHref", "exploreLinkType"];
const EXTRA_KEYS = ["extraImageUrl", "extraImageAlt"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  title: "",
  description: "",
  links: [],
  imageUrl: "",
  imageAlt: "",
  buttonLabel: "",
  buttonHref: "",
  buttonLinkType: "internal",
});

export default function DualImageTextContentForm({
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
      <InspectorSection
        title="First section"
        onReset={() => reset(FIRST_KEYS)}
      >
        <InspectorField
          id="dual-image-first-title"
          label="Title"
          value={content.firstSectionTitle || ""}
          onChange={(value) => updateField("firstSectionTitle", value)}
        />
        <InspectorField
          id="dual-image-first-description"
          label="Description"
          value={content.firstSectionDescription || ""}
          onChange={(value) => updateField("firstSectionDescription", value)}
          multiline
        />
        <InspectorField
          id="dual-image-first-image"
          label="Image URL"
          value={content.firstSectionImageUrl || ""}
          onChange={(value) => updateField("firstSectionImageUrl", value)}
        />
        <InspectorField
          id="dual-image-first-image-alt"
          label="Image alt"
          value={content.firstSectionImageAlt || ""}
          onChange={(value) => updateField("firstSectionImageAlt", value)}
        />
      </InspectorSection>

      <InspectorSection title="Items" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={emptyItem}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`dual-image-item-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`dual-image-item-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`dual-image-item-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`dual-image-item-${index}-image-alt`}
                label="Image alt"
                value={item.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
              <InspectorField
                id={`dual-image-item-${index}-cta-label`}
                label="Button label"
                value={item.buttonLabel || ""}
                onChange={(value) => update("buttonLabel", value)}
              />
              <InspectorField
                id={`dual-image-item-${index}-cta-href`}
                label="Button URL"
                value={item.buttonHref || ""}
                onChange={(value) => update("buttonHref", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorButtonSection
        idPrefix="dual-image-explore"
        heading="Button"
        label={content.exploreLabel}
        href={content.exploreHref}
        linkType={content.exploreLinkType}
        onLabelChange={(value) => updateField("exploreLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            exploreLinkType: type,
            exploreHref: href,
          })
        }
        onReset={() => reset(EXPLORE_KEYS)}
      />

      <InspectorSection title="Extra image" onReset={() => reset(EXTRA_KEYS)}>
        <InspectorField
          id="dual-image-extra"
          label="Image URL"
          value={content.extraImageUrl || ""}
          onChange={(value) => updateField("extraImageUrl", value)}
        />
        <InspectorField
          id="dual-image-extra-alt"
          label="Image alt"
          value={content.extraImageAlt || ""}
          onChange={(value) => updateField("extraImageAlt", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="dual-image-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
            content.firstSectionTitle,
            content.firstSectionDescription
          ),
          items: content.items,
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
