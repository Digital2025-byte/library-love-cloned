import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import LegalBodyTermsContentForm from "./LegalBodyTermsContentForm";
import {
  DEFAULT_LEGAL_BODY_TERMS_STYLE,
  LEGAL_BODY_TERMS_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function LegalBodyTermsStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_LEGAL_BODY_TERMS_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(LEGAL_BODY_TERMS_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showChip}
          onChange={() => toggle("showChip")}
          label="Date chip"
          hint="Effective date badge"
        />
        {style.showChip ? (
          <InspectorColor
            label="Chip color"
            value={style.chipColor}
            onChange={(value) => update("chipColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showAcceptance}
          onChange={() => toggle("showAcceptance")}
          label="Acceptance"
          hint="Acceptance alert"
        />
        <InspectorSwitch
          checked={style.showSections}
          onChange={() => toggle("showSections")}
          label="Sections"
          hint="Terms rows and cards"
        />
        <InspectorSwitch
          checked={style.showContact}
          onChange={() => toggle("showContact")}
          label="Contact"
          hint="Contact card at the end"
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
        onReset={() => reset(LEGAL_BODY_TERMS_STYLE_RESET_KEYS.copy)}
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

export default function LegalBodyTermsPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <LegalBodyTermsContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <LegalBodyTermsStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
