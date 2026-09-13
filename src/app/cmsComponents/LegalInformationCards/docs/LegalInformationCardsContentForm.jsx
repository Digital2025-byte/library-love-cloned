"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";

const ICON_OPTIONS = [
  { value: "shield", label: "Shield" },
  { value: "cookie", label: "Cookie" },
  { value: "document", label: "Document" },
];

const emptyCard = () => ({
  title: "",
  description: "",
  links: [],
  icon: "document",
  ctaLabel: "",
  slug: "",
});

export default function LegalInformationCardsContentForm({
  content,
  onChange,
  defaults,
}) {
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Items" onReset={() => reset(["cards"])}>
        <InspectorRepeater
          items={content.cards || []}
          createItem={emptyCard}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(cards) => onChange({ ...content, cards })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`legal-cards-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`legal-cards-${index}-desc`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorSelect
                id={`legal-cards-${index}-icon`}
                label="Icon"
                value={item.icon || "document"}
                options={ICON_OPTIONS}
                onChange={(value) => update("icon", value)}
              />
              <InspectorField
                id={`legal-cards-${index}-cta`}
                label="Button"
                value={item.ctaLabel || ""}
                onChange={(value) => update("ctaLabel", value)}
              />
              <InspectorField
                id={`legal-cards-${index}-slug`}
                label="Slug"
                value={item.slug || ""}
                onChange={(value) => update("slug", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="legal-cards-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          items: content.cards,
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
