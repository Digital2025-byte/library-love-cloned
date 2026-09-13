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
import MixedRightThreeImagesContentForm from "./MixedRightThreeImagesContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_MIXED_THREE_IMAGES_STYLE,
  IMAGE_SIDE_OPTIONS,
  MIXED_THREE_IMAGES_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function MixedRightThreeImagesStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_MIXED_THREE_IMAGES_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(MIXED_THREE_IMAGES_STYLE_RESET_KEYS.layout)}
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
        {style.showTitle || style.showDescription ? (
          <InspectorChoose
            label="Alignment"
            name="titleAlign"
            value={style.titleAlign}
            options={TITLE_ALIGN_OPTIONS}
            onChange={(value) => update("titleAlign", value)}
          />
        ) : null}
        <InspectorChoose
          label="Large image"
          name="imageSide"
          value={style.imageSide}
          options={IMAGE_SIDE_OPTIONS}
          onChange={(value) => update("imageSide", value)}
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
        onReset={() => reset(MIXED_THREE_IMAGES_STYLE_RESET_KEYS.images)}
      >
        <InspectorSwitch
          checked={style.showLargeImage}
          onChange={() => toggle("showLargeImage")}
          label="Large photo"
          hint="Tall feature image"
        />
        <InspectorSwitch
          checked={style.showSmallImages}
          onChange={() => toggle("showSmallImages")}
          label="Small photos"
          hint="The pair of square images"
        />
        <InspectorChoose
          label="Corners"
          name="imageRadius"
          value={style.imageRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("imageRadius", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(MIXED_THREE_IMAGES_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showPrimary}
          onChange={() => toggle("showPrimary")}
          label="Primary"
          hint="Main CTA with arrow"
        />
        {style.showPrimary ? (
          <>
            <InspectorColor
              label="Primary background"
              value={style.primaryBg}
              onChange={(value) => update("primaryBg", value)}
            />
            <InspectorColor
              label="Primary text"
              value={style.primaryText}
              onChange={(value) => update("primaryText", value)}
            />
          <InspectorFontWeight
            id="primaryText-weight"
            label="Primary text weight"
            value={style.primaryTextFontWeight}
            onChange={(value) => update("primaryTextFontWeight", value)}
          />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showSecondary}
          onChange={() => toggle("showSecondary")}
          label="Secondary"
          hint="Outline CTA"
        />
        {style.showSecondary ? (
          <InspectorColor
            label="Secondary color"
            value={style.secondaryText}
            onChange={(value) => update("secondaryText", value)}
          />
        ) : null}
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(MIXED_THREE_IMAGES_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_MIXED_THREE_IMAGES_STYLE}
      />
    </div>
  );
}

export default function MixedRightThreeImagesPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <MixedRightThreeImagesContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <MixedRightThreeImagesStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
