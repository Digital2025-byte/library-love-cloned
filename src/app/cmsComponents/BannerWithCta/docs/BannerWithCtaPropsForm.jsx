import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksStyleSection } from "@/app/cmsComponents/shared/backlinks";
import { BackgroundImageControls } from "@/app/cmsComponents/shared/backgroundImage";
import BannerWithCtaContentForm from "./BannerWithCtaContentForm";
import {
  BANNER_WITH_CTA_STYLE_RESET_KEYS,
  CARD_RADIUS_OPTIONS,
  DEFAULT_BANNER_WITH_CTA_STYLE,
  HEIGHT_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
} from "../utils/style";

function BannerWithCtaStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_BANNER_WITH_CTA_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(BANNER_WITH_CTA_STYLE_RESET_KEYS.layout)}
      >
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
        {style.showTitle || style.showDescription || style.showButton ? (
          <>
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
          </>
        ) : null}
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
        title="Banner"
        onReset={() => reset(BANNER_WITH_CTA_STYLE_RESET_KEYS.banner)}
      >
        <InspectorSwitch
          checked={style.showHeroImage}
          onChange={() => toggle("showHeroImage")}
          label="Image"
          hint="Photo behind the banner"
        />
        <BackgroundImageControls
          style={style}
          onChange={onChange}
          visible={Boolean(style.showHeroImage)}
          idPrefix="banner-with-cta"
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
        onReset={() => reset(BANNER_WITH_CTA_STYLE_RESET_KEYS.button)}
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
          </>
        ) : null}
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(BANNER_WITH_CTA_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_BANNER_WITH_CTA_STYLE}
      />
    </div>
  );
}

export default function BannerWithCtaPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <BannerWithCtaContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<BannerWithCtaStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
