"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const emptyPair = () => ({ title: "", description: "" });
const emptyText = () => ({ text: "" });

export default function LegalBodyCookiesContentForm({
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
      <InspectorSection
        title="Cover"
        onReset={() =>
          reset(["effectiveDate", "coverTitle", "coverDescription"])
        }
      >
        <InspectorField
          id="legal-cookies-date"
          label="Effective date"
          value={content.effectiveDate || ""}
          onChange={(value) => updateField("effectiveDate", value)}
        />
        <InspectorField
          id="legal-cookies-cover-title"
          label="Cover title"
          value={content.coverTitle || ""}
          onChange={(value) => updateField("coverTitle", value)}
        />
        <InspectorField
          id="legal-cookies-cover-desc"
          label="Cover description"
          value={content.coverDescription || ""}
          onChange={(value) => updateField("coverDescription", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection
        title="Introduction"
        onReset={() => reset(["introTitle", "introContent"])}
      >
        <InspectorField
          id="legal-cookies-intro-title"
          label="Title"
          value={content.introTitle || ""}
          onChange={(value) => updateField("introTitle", value)}
        />
        <InspectorField
          id="legal-cookies-intro-content"
          label="Copy"
          value={content.introContent || ""}
          onChange={(value) => updateField("introContent", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection
        title="Cookie types"
        onReset={() => reset(["typesTitle", "types"])}
      >
        <InspectorField
          id="legal-cookies-types-title"
          label="Title"
          value={content.typesTitle || ""}
          onChange={(value) => updateField("typesTitle", value)}
        />
        <InspectorRepeater
          items={content.types || []}
          createItem={emptyPair}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(types) => onChange({ ...content, types })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`legal-cookies-type-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`legal-cookies-type-${index}-desc`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection
        title="Third party"
        onReset={() =>
          reset(["thirdPartyTitle", "thirdPartyDescription", "providers"])
        }
      >
        <InspectorField
          id="legal-cookies-third-title"
          label="Title"
          value={content.thirdPartyTitle || ""}
          onChange={(value) => updateField("thirdPartyTitle", value)}
        />
        <InspectorField
          id="legal-cookies-third-desc"
          label="Description"
          value={content.thirdPartyDescription || ""}
          onChange={(value) => updateField("thirdPartyDescription", value)}
          multiline
        />
        <InspectorRepeater
          items={content.providers || []}
          createItem={emptyText}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(providers) => onChange({ ...content, providers })}
        >
          {(item, { index, update }) => (
            <InspectorField
              id={`legal-cookies-provider-${index}`}
              label="Name"
              value={item.text || ""}
              onChange={(value) => update("text", value)}
            />
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection
        title="Preferences"
        onReset={() =>
          reset([
            "preferencesTitle",
            "preferencesIntro",
            "preferencesNote",
            "methods",
          ])
        }
      >
        <InspectorField
          id="legal-cookies-pref-title"
          label="Title"
          value={content.preferencesTitle || ""}
          onChange={(value) => updateField("preferencesTitle", value)}
        />
        <InspectorField
          id="legal-cookies-pref-intro"
          label="Intro"
          value={content.preferencesIntro || ""}
          onChange={(value) => updateField("preferencesIntro", value)}
          multiline
        />
        <InspectorRepeater
          items={content.methods || []}
          createItem={emptyPair}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(methods) => onChange({ ...content, methods })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`legal-cookies-method-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`legal-cookies-method-${index}-desc`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
        <InspectorField
          id="legal-cookies-pref-note"
          label="Note"
          value={content.preferencesNote || ""}
          onChange={(value) => updateField("preferencesNote", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection
        title="Lifespan"
        onReset={() =>
          reset(["lifespanTitle", "lifespanIntro", "lifespanItems"])
        }
      >
        <InspectorField
          id="legal-cookies-life-title"
          label="Title"
          value={content.lifespanTitle || ""}
          onChange={(value) => updateField("lifespanTitle", value)}
        />
        <InspectorField
          id="legal-cookies-life-intro"
          label="Intro"
          value={content.lifespanIntro || ""}
          onChange={(value) => updateField("lifespanIntro", value)}
          multiline
        />
        <InspectorRepeater
          items={content.lifespanItems || []}
          createItem={emptyPair}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(lifespanItems) => onChange({ ...content, lifespanItems })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`legal-cookies-life-${index}-title`}
                label="Title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`legal-cookies-life-${index}-desc`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection
        title="Updates"
        onReset={() => reset(["updatesTitle", "updatesDescription"])}
      >
        <InspectorField
          id="legal-cookies-updates-title"
          label="Title"
          value={content.updatesTitle || ""}
          onChange={(value) => updateField("updatesTitle", value)}
        />
        <InspectorField
          id="legal-cookies-updates-desc"
          label="Description"
          value={content.updatesDescription || ""}
          onChange={(value) => updateField("updatesDescription", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection
        title="Contact"
        onReset={() =>
          reset([
            "contactTitle",
            "contactDescription",
            "company",
            "department",
            "email",
            "phone",
          ])
        }
      >
        <InspectorField
          id="legal-cookies-contact-title"
          label="Title"
          value={content.contactTitle || ""}
          onChange={(value) => updateField("contactTitle", value)}
        />
        <InspectorField
          id="legal-cookies-contact-desc"
          label="Description"
          value={content.contactDescription || ""}
          onChange={(value) => updateField("contactDescription", value)}
          multiline
        />
        <InspectorField
          id="legal-cookies-company"
          label="Company"
          value={content.company || ""}
          onChange={(value) => updateField("company", value)}
        />
        <InspectorField
          id="legal-cookies-department"
          label="Department"
          value={content.department || ""}
          onChange={(value) => updateField("department", value)}
        />
        <InspectorField
          id="legal-cookies-email"
          label="Email"
          value={content.email || ""}
          onChange={(value) => updateField("email", value)}
        />
        <InspectorField
          id="legal-cookies-phone"
          label="Phone"
          value={content.phone || ""}
          onChange={(value) => updateField("phone", value)}
        />
      </InspectorSection>
    </div>
  );
}
