"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";
import { SIGHT_TAG_ICON_OPTIONS } from "@/constants/Icons";

const SEARCH_KEYS = ["searchPlaceholder"];
const TITLE_KEYS = [
  "gridTitle",
  "allLabel",
  "exploreLabel",
  "exploreMagazineLabel",
];
const TAG_KEYS = ["tags"];
const ITEM_KEYS = ["items"];

const emptyTag = () => ({ name: "", icon: "" });
const emptyItem = () => ({
  name: "",
  cityName: "",
  tag: "",
  slug: "",
  description: "",
  links: [],
  imageUrl: "",
});

const iconOptions = [
  { value: "", label: "None" },
  ...SIGHT_TAG_ICON_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];

export default function SearchWithTabsAndGridContentForm({
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
      <InspectorSection title="Search" onReset={() => reset(SEARCH_KEYS)}>
        <InspectorField
          id="search-grid-placeholder"
          label="Placeholder"
          value={content.searchPlaceholder || ""}
          onChange={(value) => updateField("searchPlaceholder", value)}
        />
      </InspectorSection>

      <InspectorSection title="Copy" onReset={() => reset(TITLE_KEYS)}>
        <InspectorField
          id="search-grid-title"
          label="Grid title"
          value={content.gridTitle || ""}
          onChange={(value) => updateField("gridTitle", value)}
        />
        <InspectorField
          id="search-grid-all"
          label="All label"
          value={content.allLabel || ""}
          onChange={(value) => updateField("allLabel", value)}
        />
        <InspectorField
          id="search-grid-explore"
          label="Explore label"
          value={content.exploreLabel || ""}
          onChange={(value) => updateField("exploreLabel", value)}
        />
        <InspectorField
          id="search-grid-magazine"
          label="Magazine label"
          value={content.exploreMagazineLabel || ""}
          onChange={(value) => updateField("exploreMagazineLabel", value)}
        />
      </InspectorSection>

      <InspectorSection title="Tabs" onReset={() => reset(TAG_KEYS)}>
        <InspectorRepeater
          items={content.tags || []}
          createItem={emptyTag}
          itemLabel={(item, index) => item.name || `Tab ${index + 1}`}
          addLabel="Add Tab"
          onChange={(tags) => onChange({ ...content, tags })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`search-grid-tag-${index}-name`}
                label="Name"
                value={item.name || ""}
                onChange={(value) => update("name", value)}
              />
              <InspectorSelect
                id={`search-grid-tag-${index}-icon`}
                label="Icon"
                value={item.icon || ""}
                options={iconOptions}
                onChange={(value) => update("icon", value)}
              />
            </>
          )}
        </InspectorRepeater>
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
                id={`search-grid-${index}-name`}
                label="Name"
                value={item.name || ""}
                onChange={(value) => update("name", value)}
              />
              <InspectorField
                id={`search-grid-${index}-city`}
                label="City"
                value={item.cityName || ""}
                onChange={(value) => update("cityName", value)}
              />
              <InspectorField
                id={`search-grid-${index}-tag`}
                label="Tag"
                value={item.tag || ""}
                onChange={(value) => update("tag", value)}
              />
              <InspectorField
                id={`search-grid-${index}-slug`}
                label="Slug"
                value={item.slug || ""}
                onChange={(value) => update("slug", value)}
              />
              <InspectorField
                id={`search-grid-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`search-grid-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="search-grid-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: content.gridTitle,
          items: content.items,
          titleKey: "name",
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
