"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  title: "",
  subtitle: "",
  badge: "",
  imageUrl: "",
  imageAlt: "",
});

export default function CoolSlideGalleryContentForm({
  content,
  onChange,
  defaults,
}) {
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
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
                id={`cool-slide-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`cool-slide-${index}-subtitle`}
                label="Subtitle"
                value={item.subtitle || ""}
                onChange={(value) => update("subtitle", value)}
              />
              <InspectorField
                id={`cool-slide-${index}-badge`}
                label="Badge"
                value={item.badge || ""}
                onChange={(value) => update("badge", value)}
              />
              <InspectorField
                id={`cool-slide-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`cool-slide-${index}-alt`}
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
