"use client";

import {
  InspectorField,
  InspectorLink,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const TITLE_KEYS = ["title"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  cityName: "",
  countryName: "",
  iataCode: "",
  imageUrl: "",
  imageAlt: "",
  discoverLabel: "",
  buttonHref: "",
  buttonLinkType: "internal",
});

export default function CarouselItemContentForm({
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
          id="carousel-item-title"
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
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`carousel-item-${index}-city`}
                label="City"
                value={item.cityName || ""}
                onChange={(value) => update("cityName", value)}
              />
              <InspectorField
                id={`carousel-item-${index}-country`}
                label="Country"
                value={item.countryName || ""}
                onChange={(value) => update("countryName", value)}
              />
              <InspectorField
                id={`carousel-item-${index}-iata`}
                label="IATA code"
                value={item.iataCode || ""}
                onChange={(value) => update("iataCode", value)}
              />
              <InspectorField
                id={`carousel-item-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`carousel-item-${index}-alt`}
                label="Image alt"
                value={item.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
              <InspectorField
                id={`carousel-item-${index}-button`}
                label="Button label"
                value={item.discoverLabel || ""}
                onChange={(value) => update("discoverLabel", value)}
              />
              <InspectorLink
                id={`carousel-item-${index}-link`}
                type={item.buttonLinkType}
                href={item.buttonHref}
                onChange={({ type, href }) => {
                  const items = (content.items || []).map((card, cardIndex) =>
                    cardIndex === index
                      ? { ...card, buttonLinkType: type, buttonHref: href }
                      : card
                  );
                  onChange({ ...content, items });
                }}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
