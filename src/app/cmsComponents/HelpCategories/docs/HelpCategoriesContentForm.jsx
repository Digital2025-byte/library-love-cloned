"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";
import { HELP_CATEGORY_ICON_OPTIONS } from "../utils/constants";

const HEADER_KEYS = ["title", "subtitle"];

const emptyCard = () => ({
  icon: "question",
  title: "",
  description: "",
  href: "",
});

export default function HelpCategoriesContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Header" onReset={() => reset(HEADER_KEYS)}>
        <InspectorField
          id="help-categories-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="help-categories-subtitle"
          label="Subtitle"
          value={content.subtitle || ""}
          onChange={(value) => updateField("subtitle", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Cards" onReset={() => reset(["cards"])}>
        <InspectorRepeater
          items={content.cards || []}
          createItem={emptyCard}
          itemLabel={(item, index) => item.title || `Card ${index + 1}`}
          addLabel="Add Card"
          onChange={(cards) => onChange({ ...content, cards })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorSelect
                id={`help-categories-${index}-icon`}
                label="Icon"
                value={item.icon || "question"}
                options={HELP_CATEGORY_ICON_OPTIONS}
                onChange={(value) => update("icon", value)}
              />
              <InspectorField
                id={`help-categories-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`help-categories-${index}-desc`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`help-categories-${index}-href`}
                label="Link (href)"
                value={item.href || ""}
                onChange={(value) => update("href", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
