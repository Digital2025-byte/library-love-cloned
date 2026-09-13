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
import VerticalImageSliceTextSectionContentForm from "./VerticalImageSliceTextSectionContentForm";
import {
  DEFAULT_VERTICAL_IMAGE_SLICE_STYLE,
  IMAGE_SIDE_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  VERTICAL_IMAGE_SLICE_STYLE_RESET_KEYS,
} from "../utils/style";

function VerticalImageSliceTextSectionStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_VERTICAL_IMAGE_SLICE_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(VERTICAL_IMAGE_SLICE_STYLE_RESET_KEYS.layout)}
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
            <InspectorColor
              label="Highlight color"
              value={style.highlightColor}
              onChange={(value) => update("highlightColor", value)}
            />
          <InspectorFontWeight
            id="highlightColor-weight"
            label="Highlight weight"
            value={style.highlightFontWeight}
            onChange={(value) => update("highlightFontWeight", value)}
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
          label="Image"
          name="imageSide"
          value={style.imageSide}
          options={IMAGE_SIDE_OPTIONS}
          onChange={(value) => update("imageSide", value)}
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
        onReset={() => reset(VERTICAL_IMAGE_SLICE_STYLE_RESET_KEYS.images)}
      >
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Photo"
          hint="Masked slice image"
        />
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(VERTICAL_IMAGE_SLICE_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_VERTICAL_IMAGE_SLICE_STYLE}
      />
    </div>
  );
}

export default function VerticalImageSliceTextSectionPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <VerticalImageSliceTextSectionContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <VerticalImageSliceTextSectionStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
