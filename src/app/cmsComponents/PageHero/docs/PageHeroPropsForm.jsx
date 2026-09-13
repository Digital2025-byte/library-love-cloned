import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import PageHeroContentForm from "./PageHeroContentForm";
import {
  DEFAULT_PAGE_HERO_STYLE,
  IMAGE_RADIUS_OPTIONS,
  IMAGE_SIDE_OPTIONS,
  PAGE_HERO_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function PageHeroStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_PAGE_HERO_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(PAGE_HERO_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color behind the hero"
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
          label="Alignment"
          name="titleAlign"
          value={style.titleAlign}
          options={TITLE_ALIGN_OPTIONS}
          onChange={(value) => update("titleAlign", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Text"
        onReset={() => reset(PAGE_HERO_STYLE_RESET_KEYS.text)}
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
              id="pageHero-title-weight"
              label="Title weight"
              value={style.titleFontWeight}
              onChange={(value) => update("titleFontWeight", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showSubtitle}
          onChange={() => toggle("showSubtitle")}
          label="Subtitle"
          hint="Show text under the title"
        />
        {style.showSubtitle ? (
          <>
            <InspectorColor
              label="Subtitle color"
              value={style.subtitleColor}
              onChange={(value) => update("subtitleColor", value)}
            />
            <InspectorFontWeight
              id="pageHero-subtitle-weight"
              label="Subtitle weight"
              value={style.subtitleFontWeight}
              onChange={(value) => update("subtitleFontWeight", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Image"
        onReset={() => reset(PAGE_HERO_STYLE_RESET_KEYS.image)}
      >
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Image"
          hint="Show the side image"
        />
        {style.showImage ? (
          <>
            <InspectorChoose
              label="Image side"
              name="imageSide"
              value={style.imageSide}
              options={IMAGE_SIDE_OPTIONS}
              onChange={(value) => update("imageSide", value)}
            />
            <InspectorChoose
              label="Corners"
              name="imageRadius"
              value={style.imageRadius}
              options={IMAGE_RADIUS_OPTIONS}
              onChange={(value) => update("imageRadius", value)}
            />
            <InspectorSwitch
              checked={style.showMask}
              onChange={() => toggle("showMask")}
              label="Mask shape"
              hint="Apply the shaped hero mask on desktop"
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function PageHeroPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <PageHeroContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<PageHeroStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
