"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";

const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  title: "",
  description: "",
  links: [],
  imageUrl: "",
});

export default function ScrollCarouselContentForm({
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
                id={`scroll-carousel-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`scroll-carousel-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`scroll-carousel-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="scroll-carousel-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          items: content.items,
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
