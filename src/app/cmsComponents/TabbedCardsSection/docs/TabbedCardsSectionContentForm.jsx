"use client";

import {
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
const ITEM_KEYS = ["items"];

const emptyCard = () => ({
  title: "",
  description: "",
  links: [],
  imageUrl: "",
  imageAlt: "",
});

const emptyTab = () => ({
  label: "",
  cards: [emptyCard()],
});

export default function TabbedCardsSectionContentForm({
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
        idPrefix="tabbed-cards"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorSection title="Tabs" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={emptyTab}
          itemLabel={(item, index) => item.label || `Tab ${index + 1}`}
          addLabel="Add Tab"
          titleKey="label"
          titlePlaceholder="Tab title"
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`tabbed-cards-${index}-label`}
                label="Tab title"
                value={item.label || ""}
                onChange={(value) => update("label", value)}
              />
              <InspectorRepeater
                items={item.cards || []}
                createItem={emptyCard}
                itemLabel={(_card, cardIndex) => `Item ${cardIndex + 1}`}
                addLabel="Add Item"
                onChange={(cards) => update("cards", cards)}
              >
                {(card, { index: cardIndex, update: updateCard }) => (
                  <>
                    <InspectorField
                      id={`tabbed-cards-${index}-${cardIndex}-title`}
                      label="Title"
                      value={card.title || ""}
                      onChange={(value) => updateCard("title", value)}
                    />
                    <InspectorField
                      id={`tabbed-cards-${index}-${cardIndex}-description`}
                      label="Description"
                      value={card.description || ""}
                      onChange={(value) => updateCard("description", value)}
                      multiline
                    />
                    <InspectorField
                      id={`tabbed-cards-${index}-${cardIndex}-image`}
                      label="Image URL"
                      value={card.imageUrl || ""}
                      onChange={(value) => updateCard("imageUrl", value)}
                    />
                    <InspectorField
                      id={`tabbed-cards-${index}-${cardIndex}-alt`}
                      label="Image alt"
                      value={card.imageAlt || ""}
                      onChange={(value) => updateCard("imageAlt", value)}
                    />
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="tabbed-cards-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
            content.title,
            content.description,
            ...(content.items || []).map((tab) => tab.label)
          ),
          items: (content.items || []).flatMap((tab) => tab.cards || []),
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
