"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSwitch,
  applyInspectorReset,
} from "@/components/inspector";

const FOLLOW_KEYS = ["followTitle", "followDescription"];
const CONTACT_KEYS = [
  "contactTitle",
  "email",
  "website",
  "phone",
  "phoneHref",
  "transportPhone",
  "transportPhoneHref",
];
const emptyLink = () => ({ href: "", alt: "", src: "" });

export default function FormFooterContentForm({
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
      <InspectorSection title="Follow" onReset={() => reset(FOLLOW_KEYS)}>
        <InspectorField
          id="form-footer-follow-title"
          label="Title"
          value={content.followTitle || ""}
          onChange={(value) => updateField("followTitle", value)}
        />
        <InspectorField
          id="form-footer-follow-desc"
          label="Description"
          value={content.followDescription || ""}
          onChange={(value) => updateField("followDescription", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Contact" onReset={() => reset(CONTACT_KEYS)}>
        <InspectorField
          id="form-footer-contact-title"
          label="Title"
          value={content.contactTitle || ""}
          onChange={(value) => updateField("contactTitle", value)}
        />
        <InspectorField
          id="form-footer-email"
          label="Email"
          value={content.email || ""}
          onChange={(value) => updateField("email", value)}
        />
        <InspectorField
          id="form-footer-website"
          label="Website"
          value={content.website || ""}
          onChange={(value) => updateField("website", value)}
        />
        <InspectorField
          id="form-footer-phone"
          label="Phone"
          value={content.phone || ""}
          onChange={(value) => updateField("phone", value)}
        />
        <InspectorField
          id="form-footer-phone-href"
          label="Phone link"
          value={content.phoneHref || ""}
          onChange={(value) => updateField("phoneHref", value)}
        />
        <InspectorField
          id="form-footer-transport-phone"
          label="Transport phone"
          value={content.transportPhone || ""}
          onChange={(value) => updateField("transportPhone", value)}
        />
        <InspectorField
          id="form-footer-transport-href"
          label="Transport phone link"
          value={content.transportPhoneHref || ""}
          onChange={(value) => updateField("transportPhoneHref", value)}
        />
        <InspectorSwitch
          checked={Boolean(content.isTransportationSurvey)}
          onChange={() =>
            updateField(
              "isTransportationSurvey",
              !content.isTransportationSurvey
            )
          }
          label="Transportation survey"
          hint="Use the transport phone number"
        />
      </InspectorSection>

      <InspectorSection
        title="Social"
        onReset={() => reset(["socialLinks"])}
      >
        <InspectorRepeater
          items={content.socialLinks || []}
          createItem={emptyLink}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(socialLinks) => onChange({ ...content, socialLinks })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`form-footer-social-${index}-alt`}
                label="Name"
                value={item.alt || ""}
                onChange={(value) => update("alt", value)}
              />
              <InspectorField
                id={`form-footer-social-${index}-href`}
                label="URL"
                value={item.href || ""}
                onChange={(value) => update("href", value)}
              />
              <InspectorField
                id={`form-footer-social-${index}-src`}
                label="Icon URL"
                value={item.src || ""}
                onChange={(value) => update("src", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection
        title="Copyright"
        onReset={() => reset(["copyright"])}
      >
        <InspectorField
          id="form-footer-copyright"
          label="Copyright"
          value={content.copyright || ""}
          onChange={(value) => updateField("copyright", value)}
        />
      </InspectorSection>
    </div>
  );
}
