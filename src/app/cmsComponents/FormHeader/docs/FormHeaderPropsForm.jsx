import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import FormHeaderContentForm from "./FormHeaderContentForm";
import {
  DEFAULT_FORM_HEADER_STYLE,
  FORM_HEADER_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function FormHeaderStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_FORM_HEADER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(FORM_HEADER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showBanner}
          onChange={() => toggle("showBanner")}
          label="Banner"
          hint="Top header image"
        />
        <InspectorSwitch
          checked={style.showPromo}
          onChange={() => toggle("showPromo")}
          label="Promo"
          hint="Promo image under the banner"
        />
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the heading"
        />
        {style.showTitle ? (
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
          hint="Show text under the title"
        />
        {style.showDescription ? (
          <>
          <InspectorColor
            label="Description color"
            value={style.descriptionColor}
            onChange={(value) => update("descriptionColor", value)}
          />
          <InspectorFontWeight
            id="descriptionColor-weight"
            label="Description weight"
            value={style.descriptionFontWeight}
            onChange={(value) => update("descriptionFontWeight", value)}
          />
        </>
        ) : null}
        {style.showTitle || style.showDescription ? (
          <InspectorChoose
            label="Alignment"
            name="titleAlign"
            value={style.titleAlign}
            options={TITLE_ALIGN_OPTIONS}
            onChange={(value) => update("titleAlign", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCta}
          onChange={() => toggle("showCta")}
          label="Button"
          hint="Start CTA bar"
        />
        {style.showCta ? (
          <>
            <InspectorColor
              label="Background"
              value={style.ctaBg}
              onChange={(value) => update("ctaBg", value)}
            />
            <InspectorColor
              label="Text"
              value={style.ctaText}
              onChange={(value) => update("ctaText", value)}
            />
          </>
        ) : null}
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

export default function FormHeaderPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <FormHeaderContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<FormHeaderStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
