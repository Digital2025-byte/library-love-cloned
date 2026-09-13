"use client";

import {
  InspectorField,
  InspectorLink,
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
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  title: "",
  description: "",
  links: [],
  imageUrl: "",
  imageAlt: "",
  imageWidth: 0,
  imageHeight: 0,
  buttonText: "",
  buttonHref: "",
  buttonLinkType: "internal",
});

export default function CardsCarouselFillImageContentForm({
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
        idPrefix="fill-image"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

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
                id={`fill-image-item-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`fill-image-item-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`fill-image-item-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`fill-image-item-${index}-alt`}
                label="Image alt"
                value={item.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
              <InspectorField
                id={`fill-image-item-${index}-button`}
                label="Button label"
                value={item.buttonText || ""}
                onChange={(value) => update("buttonText", value)}
              />
              <InspectorLink
                id={`fill-image-item-${index}-btn-link`}
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

      <BacklinksEditor
        idPrefix="fill-image-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
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
