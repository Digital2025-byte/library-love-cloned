"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const COVER_KEYS = [
  "effectiveDate",
  "effectiveDateLabel",
  "coverTitle",
  "coverDescription",
];
const ACCEPTANCE_KEYS = ["acceptanceTitle", "acceptanceMessage"];
const CONTACT_KEYS = [
  "contactTitle",
  "contactDescription",
  "company",
  "department",
  "email",
  "phone",
  "address",
];

const emptyItem = () => ({ title: "", description: "" });
const emptySection = () => ({
  title: "",
  intro: "",
  variant: "",
  items: [],
});

export default function LegalBodyTermsContentForm({
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
      <InspectorSection title="Cover" onReset={() => reset(COVER_KEYS)}>
        <InspectorField
          id="legal-terms-date-label"
          label="Date label"
          value={content.effectiveDateLabel || ""}
          onChange={(value) => updateField("effectiveDateLabel", value)}
        />
        <InspectorField
          id="legal-terms-date"
          label="Effective date"
          value={content.effectiveDate || ""}
          onChange={(value) => updateField("effectiveDate", value)}
        />
        <InspectorField
          id="legal-terms-cover-title"
          label="Cover title"
          value={content.coverTitle || ""}
          onChange={(value) => updateField("coverTitle", value)}
        />
        <InspectorField
          id="legal-terms-cover-desc"
          label="Cover description"
          value={content.coverDescription || ""}
          onChange={(value) => updateField("coverDescription", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection
        title="Acceptance"
        onReset={() => reset(ACCEPTANCE_KEYS)}
      >
        <InspectorField
          id="legal-terms-acceptance-title"
          label="Title"
          value={content.acceptanceTitle || ""}
          onChange={(value) => updateField("acceptanceTitle", value)}
        />
        <InspectorField
          id="legal-terms-acceptance-message"
          label="Message"
          value={content.acceptanceMessage || ""}
          onChange={(value) => updateField("acceptanceMessage", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Sections" onReset={() => reset(["sections"])}>
        <InspectorRepeater
          items={content.sections || []}
          createItem={emptySection}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(sections) => onChange({ ...content, sections })}
        >
          {(section, { index, update }) => (
            <>
              <InspectorField
                id={`legal-terms-section-${index}-title`}
                label="Title"
                value={section.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`legal-terms-section-${index}-intro`}
                label="Intro"
                value={section.intro || ""}
                onChange={(value) => update("intro", value)}
                multiline
              />
              <InspectorRepeater
                items={section.items || []}
                createItem={emptyItem}
                itemLabel={(_item, itemIndex) => `Item ${itemIndex + 1}`}
                addLabel="Add Item"
                onChange={(items) => update("items", items)}
              >
                {(item, { index: itemIndex, update: updateItem }) => (
                  <>
                    <InspectorField
                      id={`legal-terms-section-${index}-item-${itemIndex}-title`}
                      label="Title"
                      value={item.title || ""}
                      onChange={(value) => updateItem("title", value)}
                    />
                    <InspectorField
                      id={`legal-terms-section-${index}-item-${itemIndex}-desc`}
                      label="Description"
                      value={item.description || ""}
                      onChange={(value) => updateItem("description", value)}
                      multiline
                    />
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Contact" onReset={() => reset(CONTACT_KEYS)}>
        <InspectorField
          id="legal-terms-contact-title"
          label="Title"
          value={content.contactTitle || ""}
          onChange={(value) => updateField("contactTitle", value)}
        />
        <InspectorField
          id="legal-terms-contact-desc"
          label="Description"
          value={content.contactDescription || ""}
          onChange={(value) => updateField("contactDescription", value)}
          multiline
        />
        <InspectorField
          id="legal-terms-company"
          label="Company"
          value={content.company || ""}
          onChange={(value) => updateField("company", value)}
        />
        <InspectorField
          id="legal-terms-department"
          label="Department"
          value={content.department || ""}
          onChange={(value) => updateField("department", value)}
        />
        <InspectorField
          id="legal-terms-email"
          label="Email"
          value={content.email || ""}
          onChange={(value) => updateField("email", value)}
        />
        <InspectorField
          id="legal-terms-phone"
          label="Phone"
          value={content.phone || ""}
          onChange={(value) => updateField("phone", value)}
        />
        <InspectorField
          id="legal-terms-address"
          label="Address"
          value={content.address || ""}
          onChange={(value) => updateField("address", value)}
        />
      </InspectorSection>
    </div>
  );
}
