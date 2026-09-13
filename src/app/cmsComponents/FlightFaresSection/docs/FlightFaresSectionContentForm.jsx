"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSwitch,
  applyInspectorReset,
} from "@/components/inspector";

const TITLE_KEYS = ["title"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  hasTopBadge: false,
  topBadge: "",
  title: "",
  subtitle: "",
  hasExtraBadge: false,
  extraBadge: "",
  imageUrl: "",
  imageAlt: "",
});

export default function FlightFaresSectionContentForm({
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
      <InspectorSection title="Title" onReset={() => reset(TITLE_KEYS)}>
        <InspectorField
          id="flight-fares-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
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
              <InspectorSwitch
                checked={Boolean(item.hasTopBadge)}
                onChange={() => update("hasTopBadge", !item.hasTopBadge)}
                label="Top badge"
                hint="Corner badge on this card"
              />
              {item.hasTopBadge ? (
                <InspectorField
                  id={`flight-fares-${index}-top-badge`}
                  label="Top badge label"
                  value={item.topBadge || ""}
                  onChange={(value) => update("topBadge", value)}
                />
              ) : null}
              <InspectorField
                id={`flight-fares-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`flight-fares-${index}-subtitle`}
                label="Subtitle"
                value={item.subtitle || ""}
                onChange={(value) => update("subtitle", value)}
              />
              <InspectorSwitch
                checked={Boolean(item.hasExtraBadge)}
                onChange={() => update("hasExtraBadge", !item.hasExtraBadge)}
                label="Extra badge"
                hint="Secondary badge above the title"
              />
              {item.hasExtraBadge ? (
                <InspectorField
                  id={`flight-fares-${index}-extra-badge`}
                  label="Extra badge label"
                  value={item.extraBadge || ""}
                  onChange={(value) => update("extraBadge", value)}
                />
              ) : null}
              <InspectorField
                id={`flight-fares-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`flight-fares-${index}-alt`}
                label="Image alt"
                value={item.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
