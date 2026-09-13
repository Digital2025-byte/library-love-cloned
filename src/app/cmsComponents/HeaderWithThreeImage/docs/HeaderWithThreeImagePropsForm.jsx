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
import HeaderWithThreeImageContentForm from "./HeaderWithThreeImageContentForm";
import {
  DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
  HEADER_WITH_THREE_IMAGE_STYLE_RESET_KEYS,
  HEIGHT_OPTIONS,
  IMAGE_COUNT_OPTIONS,
  IMAGE_DIRECTION_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
} from "../utils/style";

function HeaderWithThreeImageStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(HEADER_WITH_THREE_IMAGE_STYLE_RESET_KEYS.layout)}
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
        <InspectorChoose
          label="Height"
          name="sectionHeight"
          value={style.sectionHeight}
          options={HEIGHT_OPTIONS}
          onChange={(value) => update("sectionHeight", value)}
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Solid fill behind the header"
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
        title="Banner"
        onReset={() => reset(HEADER_WITH_THREE_IMAGE_STYLE_RESET_KEYS.banner)}
      >
        <InspectorSwitch
          checked={style.showHeroImage}
          onChange={() => toggle("showHeroImage")}
          label="Images"
          hint="Background photo slices"
        />
        {style.showHeroImage ? (
          <>
            <InspectorChoose
              label="Count"
              name="imageCount"
              value={String(style.imageCount)}
              options={IMAGE_COUNT_OPTIONS}
              onChange={(value) => update("imageCount", value)}
            />
            <InspectorChoose
              label="Direction"
              name="imageDirection"
              value={style.imageDirection}
              options={IMAGE_DIRECTION_OPTIONS}
              onChange={(value) => update("imageDirection", value)}
            />
            <BackgroundImageControls
              style={style}
              onChange={onChange}
              visible
              idPrefix="header-three-image"
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Wash"
          hint="Colored fade over the photos"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Wash color"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(HEADER_WITH_THREE_IMAGE_STYLE_RESET_KEYS.button)}
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
        onReset={() => reset(HEADER_WITH_THREE_IMAGE_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE}
      />
    </div>
  );
}

export default function HeaderWithThreeImagePropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <HeaderWithThreeImageContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
          imageCount={style?.imageCount}
        />
      }
      style={
        <HeaderWithThreeImageStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
