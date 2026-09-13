import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import FormFooterContentForm from "./FormFooterContentForm";
import {
  DEFAULT_FORM_FOOTER_STYLE,
  FORM_FOOTER_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function FormFooterStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_FORM_FOOTER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(FORM_FOOTER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showFollow}
          onChange={() => toggle("showFollow")}
          label="Follow"
          hint="Follow title, copy, and social row"
        />
        {style.showFollow ? (
          <>
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
        </>
        ) : null}
        <InspectorSwitch
          checked={style.showDescription}
          onChange={() => toggle("showDescription")}
          label="Description"
          hint="Follow copy under the title"
        />
        {style.showDescription ? (
          <InspectorColor
            label="Copy color"
            value={style.descriptionColor}
            onChange={(value) => update("descriptionColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showSocial}
          onChange={() => toggle("showSocial")}
          label="Social"
          hint="Social icon links"
        />
        <InspectorSwitch
          checked={style.showContact}
          onChange={() => toggle("showContact")}
          label="Contact"
          hint="Phone, email, and website"
        />
        {style.showSocial || style.showContact ? (
          <InspectorColor
            label="Link color"
            value={style.linkColor}
            onChange={(value) => update("linkColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCopyright}
          onChange={() => toggle("showCopyright")}
          label="Copyright"
          hint="Line under the bar"
        />
        {style.showCopyright ? (
          <InspectorColor
            label="Copyright color"
            value={style.copyrightColor}
            onChange={(value) => update("copyrightColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color on the footer bar"
        />
        {style.showSectionBg ? (
          <InspectorColor
            label="Section background"
            value={style.sectionBg}
            onChange={(value) => update("sectionBg", value)}
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
    </div>
  );
}

export default function FormFooterPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <FormFooterContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<FormFooterStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
