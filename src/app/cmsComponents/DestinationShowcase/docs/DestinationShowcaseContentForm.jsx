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
const VIEW_ALL_KEYS = ["viewAllLabel", "viewAllHref", "viewAllLinkType"];
const EXPLORE_KEYS = ["exploreLabel"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  cityName: "",
  countryName: "",
  description: "",
  links: [],
  slug: "",
  imageUrl: "",
  imageAlt: "",
});

export default function DestinationShowcaseContentForm({
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
        idPrefix="destination-showcase"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="destination-showcase-view-all"
        heading="View all"
        label={content.viewAllLabel}
        href={content.viewAllHref}
        linkType={content.viewAllLinkType}
        onLabelChange={(value) => updateField("viewAllLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            viewAllLinkType: type,
            viewAllHref: href,
          })
        }
        onReset={() => reset(VIEW_ALL_KEYS)}
      />

      <InspectorSection
        title="Explore"
        onReset={() => reset(EXPLORE_KEYS)}
      >
        <InspectorField
          id="destination-showcase-explore"
          label="Button label"
          value={content.exploreLabel || ""}
          onChange={(value) => updateField("exploreLabel", value)}
        />
      </InspectorSection>

      <InspectorSection title="Items" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={emptyItem}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`destination-showcase-${index}-city`}
                label="City"
                value={item.cityName || ""}
                onChange={(value) => update("cityName", value)}
              />
              <InspectorField
                id={`destination-showcase-${index}-country`}
                label="Country"
                value={item.countryName || ""}
                onChange={(value) => update("countryName", value)}
              />
              <InspectorField
                id={`destination-showcase-${index}-slug`}
                label="Slug"
                value={item.slug || ""}
                onChange={(value) => update("slug", value)}
              />
              <InspectorField
                id={`destination-showcase-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`destination-showcase-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`destination-showcase-${index}-alt`}
                label="Image alt"
                value={item.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="destination-showcase-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
            content.title,
            content.description
          ),
          items: content.items,
          titleKey: "cityName",
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
