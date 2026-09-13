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
import DualImageTextContentForm from "./DualImageTextContentForm";
import {
  DEFAULT_DUAL_IMAGE_TEXT_STYLE,
  DUAL_IMAGE_TEXT_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function DualImageTextStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_DUAL_IMAGE_TEXT_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(DUAL_IMAGE_TEXT_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show headings on each block"
        />
        {style.showTitle ? (
          <>
            <InspectorSwitch
              checked={style.underlineFirstWord}
              onChange={() => toggle("underlineFirstWord")}
              label="Underline"
              hint="Gold underline on the first word"
            />
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
          hint="Show copy under each title"
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
          checked={style.showFirstSection}
          onChange={() => toggle("showFirstSection")}
          label="First section"
          hint="Leading intro row before the two blocks"
        />
        <InspectorSwitch
          checked={style.animate}
          onChange={() => toggle("animate")}
          label="Animate"
          hint="Fade and rise on scroll"
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color behind the section"
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

      <InspectorSection
        title="Images"
        onReset={() => reset(DUAL_IMAGE_TEXT_STYLE_RESET_KEYS.images)}
      >
        <InspectorSwitch
          checked={style.blueLayer}
          onChange={() => toggle("blueLayer")}
          label="Blue layer"
          hint="Teal wash over the photos"
        />
        <InspectorSwitch
          checked={style.showExtraImage}
          onChange={() => toggle("showExtraImage")}
          label="Extra image"
          hint="Smaller photo overlaid on each image"
        />
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(DUAL_IMAGE_TEXT_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showExploreButton}
          onChange={() => toggle("showExploreButton")}
          label="Button"
          hint="CTA under the copy"
        />
        {style.showExploreButton ? (
          <>
            <InspectorColor
              label="Button background"
              value={style.buttonBg}
              onChange={(value) => update("buttonBg", value)}
            />
            <InspectorColor
              label="Button text"
              value={style.buttonText}
              onChange={(value) => update("buttonText", value)}
            />
          <InspectorFontWeight
            id="buttonText-weight"
            label="Button text weight"
            value={style.buttonTextFontWeight}
            onChange={(value) => update("buttonTextFontWeight", value)}
          />
          </>
        ) : null}
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(DUAL_IMAGE_TEXT_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_DUAL_IMAGE_TEXT_STYLE}
      />
    </div>
  );
}

export default function DualImageTextPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <DualImageTextContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <DualImageTextStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
