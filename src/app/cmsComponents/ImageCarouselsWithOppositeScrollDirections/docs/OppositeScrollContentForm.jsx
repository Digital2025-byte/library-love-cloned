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
} from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];
const BUTTON_KEYS = ["buttonLabel", "buttonHref", "buttonLinkType"];
const TOP_KEYS = ["topRow"];
const BOTTOM_KEYS = ["bottomRow"];

const emptyCard = () => ({
  title: "",
  imageUrl: "",
  imageAlt: "",
});

function RowRepeater({ idPrefix, items, onChange }) {
  return (
    <InspectorRepeater
      items={items}
      createItem={emptyCard}
      itemLabel={(_item, index) => `Item ${index + 1}`}
      onChange={onChange}
    >
      {(item, { index, update }) => (
        <>
          <InspectorField
            id={`${idPrefix}-${index}-title`}
            label="Title"
            value={item.title || ""}
            onChange={(value) => update("title", value)}
          />
          <InspectorField
            id={`${idPrefix}-${index}-image`}
            label="Image URL"
            value={item.imageUrl || ""}
            onChange={(value) => update("imageUrl", value)}
          />
          <InspectorField
            id={`${idPrefix}-${index}-alt`}
            label="Image alt"
            value={item.imageAlt || ""}
            onChange={(value) => update("imageAlt", value)}
          />
        </>
      )}
    </InspectorRepeater>
  );
}

export default function OppositeScrollContentForm({
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
        idPrefix="opposite-scroll"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="opposite-scroll-button"
        heading="Explore"
        label={content.buttonLabel}
        href={content.buttonHref}
        linkType={content.buttonLinkType}
        onLabelChange={(value) => updateField("buttonLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({
            ...content,
            buttonLinkType: type,
            buttonHref: href,
          })
        }
        onReset={() => reset(BUTTON_KEYS)}
      />

      <InspectorSection title="Top row" onReset={() => reset(TOP_KEYS)}>
        <RowRepeater
          idPrefix="opposite-scroll-top"
          items={content.topRow || []}
          onChange={(topRow) => onChange({ ...content, topRow })}
        />
      </InspectorSection>

      <InspectorSection title="Bottom row" onReset={() => reset(BOTTOM_KEYS)}>
        <RowRepeater
          idPrefix="opposite-scroll-bottom"
          items={content.bottomRow || []}
          onChange={(bottomRow) => onChange({ ...content, bottomRow })}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="opposite-scroll-link"
        links={content.links || []}
        sourceText={joinBacklinkSourceText(content.description)}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
