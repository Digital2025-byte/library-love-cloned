import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import CtaBannerContentForm from "./CtaBannerContentForm";
import {
  CARD_RADIUS_OPTIONS,
  CTA_BANNER_STYLE_RESET_KEYS,
  DEFAULT_CTA_BANNER_STYLE,
  HEIGHT_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
} from "../utils/style";

function CtaBannerStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_CTA_BANNER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(CTA_BANNER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the heading"
        />
        <InspectorSwitch
          checked={style.showDescription}
          onChange={() => toggle("showDescription")}
          label="Description"
          hint="Show text under the title"
        />
        <InspectorChoose
          label="Alignment"
          name="titleAlign"
          value={style.titleAlign}
          options={TITLE_ALIGN_OPTIONS}
          onChange={(value) => update("titleAlign", value)}
        />
        <InspectorChoose
          label="Vertical"
          name="verticalAlign"
          value={style.verticalAlign}
          options={VERTICAL_ALIGN_OPTIONS}
          onChange={(value) => update("verticalAlign", value)}
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color behind the banner"
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
        <InspectorChoose
          label="Height"
          name="bannerHeight"
          value={style.bannerHeight}
          options={HEIGHT_OPTIONS}
          onChange={(value) => update("bannerHeight", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Text"
        onReset={() => reset(CTA_BANNER_STYLE_RESET_KEYS.title)}
      >
        <InspectorColor
          label="Title color"
          value={style.titleColor}
          onChange={(value) => update("titleColor", value)}
        />
        <InspectorFontWeight
          id="ctaBanner-title-weight"
          label="Title weight"
          value={style.titleFontWeight}
          onChange={(value) => update("titleFontWeight", value)}
        />
        <InspectorColor
          label="Description color"
          value={style.descriptionColor}
          onChange={(value) => update("descriptionColor", value)}
        />
        <InspectorFontWeight
          id="ctaBanner-description-weight"
          label="Description weight"
          value={style.descriptionFontWeight}
          onChange={(value) => update("descriptionFontWeight", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Banner"
        onReset={() => reset(CTA_BANNER_STYLE_RESET_KEYS.banner)}
      >
        <InspectorSwitch
          checked={style.showHeroImage}
          onChange={() => toggle("showHeroImage")}
          label="Image"
          hint="Photo behind the banner"
        />
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Wash"
          hint="Colored fade over the photo"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Wash color"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
        <InspectorChoose
          label="Corners"
          name="bannerRadius"
          value={style.bannerRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("bannerRadius", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(CTA_BANNER_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="CTA"
          hint="Show the call-to-action button"
        />
        {style.showButton ? (
          <>
            <InspectorColor
              label="Background"
              value={style.buttonBg}
              onChange={(value) => update("buttonBg", value)}
            />
            <InspectorColor
              label="Text"
              value={style.buttonText}
              onChange={(value) => update("buttonText", value)}
            />
            <InspectorFontWeight
              id="ctaBanner-button-weight"
              label="Text weight"
              value={style.buttonTextFontWeight}
              onChange={(value) => update("buttonTextFontWeight", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function CtaBannerPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <CtaBannerContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<CtaBannerStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
