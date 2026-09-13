"use client";

import {
  InspectorField,
  InspectorSection,
  InspectorSwitch,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";

const TITLE_KEYS = ["title", "subtitle"];
const CTA_KEYS = ["ctaLabel"];
const IMAGE_KEYS = [
  "headerImageSrc",
  "promoImageSrc",
  "promoHref",
  "promoAlt",
  "promoLinkType",
];
const FLAG_KEYS = ["isTransportationSurvey"];

export default function FormHeaderContentForm({
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
        idPrefix="form-header"
        title={content.title}
        description={content.subtitle}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("subtitle", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorSection title="Button" onReset={() => reset(CTA_KEYS)}>
        <InspectorField
          id="form-header-cta"
          label="Label"
          value={content.ctaLabel || ""}
          onChange={(value) => updateField("ctaLabel", value)}
        />
      </InspectorSection>

      <InspectorSection title="Images" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="form-header-banner"
          label="Banner URL"
          value={content.headerImageSrc || ""}
          onChange={(value) => updateField("headerImageSrc", value)}
        />
        <InspectorField
          id="form-header-promo"
          label="Promo image URL"
          value={content.promoImageSrc || ""}
          onChange={(value) => updateField("promoImageSrc", value)}
        />
        <InspectorField
          id="form-header-promo-alt"
          label="Promo alt"
          value={content.promoAlt || ""}
          onChange={(value) => updateField("promoAlt", value)}
        />
        <InspectorField
          id="form-header-promo-href"
          label="Promo URL"
          value={content.promoHref || ""}
          onChange={(value) => updateField("promoHref", value)}
        />
      </InspectorSection>

      <InspectorSection title="Survey" onReset={() => reset(FLAG_KEYS)}>
        <InspectorSwitch
          checked={Boolean(content.isTransportationSurvey)}
          onChange={() =>
            updateField(
              "isTransportationSurvey",
              !content.isTransportationSurvey
            )
          }
          label="Transportation survey"
          hint="Hides the promo image"
        />
      </InspectorSection>
    </div>
  );
}
