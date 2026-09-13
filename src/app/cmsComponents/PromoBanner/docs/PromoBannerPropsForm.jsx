import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import PromoBannerContentForm from "./PromoBannerContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_PROMO_BANNER_STYLE,
  HEIGHT_OPTIONS,
  PROMO_BANNER_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function PromoBannerStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_PROMO_BANNER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(PROMO_BANNER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorChoose
          label="Height"
          name="bannerHeight"
          value={style.bannerHeight}
          options={HEIGHT_OPTIONS}
          onChange={(value) => update("bannerHeight", value)}
        />
        <InspectorChoose
          label="Corners"
          name="bannerRadius"
          value={style.bannerRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("bannerRadius", value)}
        />
        <InspectorChoose
          label="Padding"
          name="sectionPadding"
          value={style.sectionPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("sectionPadding", value)}
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Section background"
        />
        {style.showSectionBg ? (
          <InspectorColor
            label="Section background"
            value={style.sectionBg}
            onChange={(value) => update("sectionBg", value)}
          />
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Overlay & text"
        onReset={() => reset(PROMO_BANNER_STYLE_RESET_KEYS.overlay)}
      >
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
        <InspectorColor
          label="Title color"
          value={style.titleColor}
          onChange={(value) => update("titleColor", value)}
        />
        <InspectorFontWeight
          id="promo-title-weight"
          label="Title weight"
          value={style.titleFontWeight}
          onChange={(value) => update("titleFontWeight", value)}
        />
        <InspectorColor
          label="Description color"
          value={style.descriptionColor}
          onChange={(value) => update("descriptionColor", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(PROMO_BANNER_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="Button"
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
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function PromoBannerPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <PromoBannerContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<PromoBannerStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
