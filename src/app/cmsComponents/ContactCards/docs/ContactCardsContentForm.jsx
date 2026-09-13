"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";
import { CONTACT_ICON_OPTIONS } from "../utils/constants";

const HEADER_KEYS = ["title", "subtitle"];
const FOOTER_KEYS = ["footerLabel", "footerHref", "footerLinkType"];

const emptyCard = () => ({
  icon: "clipboard",
  title: "",
  description: "",
  cta: "",
  href: "",
});

export default function ContactCardsContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Header" onReset={() => reset(HEADER_KEYS)}>
        <InspectorField
          id="contact-cards-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="contact-cards-subtitle"
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
          titleKey="title"
          titlePlaceholder="Card title"
          onChange={(cards) => onChange({ ...content, cards })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorSelect
                id={`contact-cards-${index}-icon`}
                label="Icon"
                value={item.icon || "clipboard"}
                options={CONTACT_ICON_OPTIONS}
                onChange={(value) => update("icon", value)}
              />
              <InspectorField
                id={`contact-cards-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`contact-cards-${index}-desc`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`contact-cards-${index}-cta`}
                label="CTA label (Channels variant)"
                value={item.cta || ""}
                onChange={(value) => update("cta", value)}
              />
              <InspectorField
                id={`contact-cards-${index}-href`}
                label="Link (href)"
                value={item.href || ""}
                onChange={(value) => update("href", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorButtonSection
        idPrefix="contact-cards-footer"
        heading="Footer link (Forms variant)"
        label={content.footerLabel}
        href={content.footerHref}
        linkType={content.footerLinkType}
        onLabelChange={(value) => updateField("footerLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({ ...content, footerLinkType: type, footerHref: href })
        }
        onReset={() => reset(FOOTER_KEYS)}
      />
    </div>
  );
}
