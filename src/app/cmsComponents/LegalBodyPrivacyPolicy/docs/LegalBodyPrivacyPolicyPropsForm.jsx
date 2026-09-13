import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import LegalBodyPrivacyPolicyContentForm from "./LegalBodyPrivacyPolicyContentForm";
import {
  DEFAULT_LEGAL_BODY_PRIVACY_POLICY_STYLE,
  LEGAL_BODY_PRIVACY_POLICY_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function LegalBodyPrivacyPolicyStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(
        style,
        DEFAULT_LEGAL_BODY_PRIVACY_POLICY_STYLE,
        keys
      )
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() =>
          reset(LEGAL_BODY_PRIVACY_POLICY_STYLE_RESET_KEYS.layout)
        }
      >
        <InspectorSwitch
          checked={style.showChip}
          onChange={() => toggle("showChip")}
          label="Date chip"
          hint="Last updated badge"
        />
        {style.showChip ? (
          <InspectorColor
            label="Chip color"
            value={style.chipColor}
            onChange={(value) => update("chipColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showIntroduction}
          onChange={() => toggle("showIntroduction")}
          label="Introduction"
          hint="Summary of key points intro"
        />
        <InspectorSwitch
          checked={style.showSummary}
          onChange={() => toggle("showSummary")}
          label="Summary"
          hint="Table of contents cards"
        />
        <InspectorSwitch
          checked={style.showSections}
          onChange={() => toggle("showSections")}
          label="Sections"
          hint="Policy body sections"
        />
        <InspectorSwitch
          checked={style.showContact}
          onChange={() => toggle("showContact")}
          label="Contact"
          hint="Contact and review sections"
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color behind the whole section"
        />
        {style.showSectionBg ? (
          <InspectorColor
            label="Section background"
            value={style.sectionBg}
            onChange={(value) => update("sectionBg", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCardBg}
          onChange={() => toggle("showCardBg")}
          label="Paper fill"
          hint="Background on the inner paper"
        />
        {style.showCardBg ? (
          <InspectorColor
            label="Paper background"
            value={style.cardBg}
            onChange={(value) => update("cardBg", value)}
          />
        ) : null}
        <InspectorChoose
          label="Padding"
          name="sectionPadding"
          value={style.sectionPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("sectionPadding", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Copy"
        onReset={() => reset(LEGAL_BODY_PRIVACY_POLICY_STYLE_RESET_KEYS.copy)}
      >
        <InspectorColor
          label="Title color"
          value={style.titleColor}
          onChange={(value) => update("titleColor", value)}
        />
          <InspectorFontWeight
            id="titleColor-weight"
            label="Title weight"
            value={style.titleFontWeight}
            onChange={(value) => update("titleFontWeight", value)}
          />
        <InspectorColor
          label="Body color"
          value={style.bodyColor}
          onChange={(value) => update("bodyColor", value)}
        />
          <InspectorFontWeight
            id="bodyColor-weight"
            label="Body weight"
            value={style.bodyFontWeight}
            onChange={(value) => update("bodyFontWeight", value)}
          />
      </InspectorSection>
    </div>
  );
}

export default function LegalBodyPrivacyPolicyPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <LegalBodyPrivacyPolicyContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <LegalBodyPrivacyPolicyStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
