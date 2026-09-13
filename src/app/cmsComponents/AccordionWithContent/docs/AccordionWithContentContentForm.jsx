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
const BUTTON_KEYS = ["buttonLabel", "buttonHref", "buttonLinkType"];
const ITEM_KEYS = ["items"];

export default function AccordionWithContentContentForm({
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
        idPrefix="accordion"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorButtonSection
        idPrefix="accordion-button"
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

      <InspectorSection title="Items" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items}
          createItem={() => ({ title: "", description: "", links: [] })}
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`accordion-item-${index}-title`}
                label="Title"
                value={item.title}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`accordion-item-${index}-description`}
                label="Description"
                value={item.description}
                onChange={(value) => update("description", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="accordion-link"
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
