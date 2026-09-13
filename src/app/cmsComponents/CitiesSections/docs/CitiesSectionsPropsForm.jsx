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
import CitiesSectionsContentForm from "./CitiesSectionsContentForm";
import {
  CARD_RADIUS_OPTIONS,
  CITIES_SECTIONS_STYLE_RESET_KEYS,
  DEFAULT_CITIES_SECTIONS_STYLE,
  IMAGE_SIDE_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function CitiesSectionsStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_CITIES_SECTIONS_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(CITIES_SECTIONS_STYLE_RESET_KEYS.layout)}
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
          label="Images"
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
        onReset={() => reset(CITIES_SECTIONS_STYLE_RESET_KEYS.images)}
      >
        <InspectorSwitch
          checked={style.showImages}
          onChange={() => toggle("showImages")}
          label="Photos"
          hint="The stacked city images"
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
        onReset={() => reset(CITIES_SECTIONS_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showCta}
          onChange={() => toggle("showCta")}
          label="Button"
          hint="Explore CTA"
        />
        {style.showCta ? (
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
        onReset={() => reset(CITIES_SECTIONS_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_CITIES_SECTIONS_STYLE}
      />
    </div>
  );
}

export default function CitiesSectionsPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <CitiesSectionsContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<CitiesSectionsStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
