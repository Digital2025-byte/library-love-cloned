"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";
import { FORM_ICON_OPTIONS } from "../utils/constants";

const emptyCard = () => ({
  icon: "ticket",
  category: "",
  title: "",
  description: "",
  href: "",
});

const emptyTab = () => ({ label: "", cards: [emptyCard()] });

export default function FormsDirectoryContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Heading" onReset={() => reset(["title"])}>
        <InspectorField
          id="forms-directory-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
      </InspectorSection>

      <InspectorSection title="Tabs" onReset={() => reset(["tabs"])}>
        <InspectorRepeater
          items={content.tabs || []}
          createItem={emptyTab}
          itemLabel={(item, index) => item.label || `Tab ${index + 1}`}
          addLabel="Add Tab"
          titleKey="label"
          titlePlaceholder="Tab title"
          onChange={(tabs) => onChange({ ...content, tabs })}
        >
          {(tab, { index, update }) => (
            <>
              <InspectorField
                id={`forms-directory-${index}-label`}
                label="Tab title"
                value={tab.label || ""}
                onChange={(value) => update("label", value)}
              />
              <InspectorRepeater
                items={tab.cards || []}
                createItem={emptyCard}
                itemLabel={(card, cardIndex) =>
                  card.title || `Form ${cardIndex + 1}`
                }
                addLabel="Add Form"
                titleKey="title"
                titlePlaceholder="Form title"
                onChange={(cards) => update("cards", cards)}
              >
                {(card, { index: cardIndex, update: updateCard }) => (
                  <>
                    <InspectorSelect
                      id={`forms-${index}-${cardIndex}-icon`}
                      label="Icon"
                      value={card.icon || "ticket"}
                      options={FORM_ICON_OPTIONS}
                      onChange={(value) => updateCard("icon", value)}
                    />
                    <InspectorField
                      id={`forms-${index}-${cardIndex}-category`}
                      label="Category"
                      value={card.category || ""}
                      onChange={(value) => updateCard("category", value)}
                    />
                    <InspectorField
                      id={`forms-${index}-${cardIndex}-title`}
                      label="Title"
                      value={card.title || ""}
                      onChange={(value) => updateCard("title", value)}
                    />
                    <InspectorField
                      id={`forms-${index}-${cardIndex}-description`}
                      label="Description"
                      value={card.description || ""}
                      onChange={(value) => updateCard("description", value)}
                      multiline
                    />
                    <InspectorField
                      id={`forms-${index}-${cardIndex}-href`}
                      label="Link (href)"
                      value={card.href || ""}
                      onChange={(value) => updateCard("href", value)}
                    />
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
