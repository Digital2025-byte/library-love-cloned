import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSelect,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksStyleSection } from "@/app/cmsComponents/shared/backlinks";
import SectionWithAnimatedImagesContentForm from "./SectionWithAnimatedImagesContentForm";
import {
  ANIMATED_IMAGES_STYLE_RESET_KEYS,
  CARDS_PER_SPAWN_OPTIONS,
  DEFAULT_ANIMATED_IMAGES_STYLE,
  FALL_DURATION_OPTIONS,
  FALLING_CARD_SIZE_OPTIONS,
  SPAWN_INTERVAL_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function SectionWithAnimatedImagesStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_ANIMATED_IMAGES_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(ANIMATED_IMAGES_STYLE_RESET_KEYS.layout)}
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
          hint="Show the line above the title"
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
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Gradient wash behind the section"
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
        title="Falling photos"
        onReset={() => reset(ANIMATED_IMAGES_STYLE_RESET_KEYS.images)}
      >
        <InspectorSwitch
          checked={style.showImages}
          onChange={() => toggle("showImages")}
          label="Falling photos"
          hint="Animated cards in the background"
        />
        {style.showImages ? (
          <>
            <InspectorSelect
              id="falling-fall-duration"
              label="Fall speed"
              value={style.fallDuration}
              options={FALL_DURATION_OPTIONS}
              onChange={(value) => update("fallDuration", value)}
            />
            <InspectorSelect
              id="falling-spawn-interval"
              label="Spawn rate"
              value={style.spawnInterval}
              options={SPAWN_INTERVAL_OPTIONS}
              onChange={(value) => update("spawnInterval", value)}
            />
            <InspectorSelect
              id="falling-cards-per-spawn"
              label="Cards per wave"
              value={style.cardsPerSpawn}
              options={CARDS_PER_SPAWN_OPTIONS}
              onChange={(value) => update("cardsPerSpawn", value)}
            />
            <InspectorChoose
              label="Card size"
              name="fallingCardSize"
              value={style.fallingCardSize}
              options={FALLING_CARD_SIZE_OPTIONS}
              onChange={(value) => update("fallingCardSize", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(ANIMATED_IMAGES_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showCta}
          onChange={() => toggle("showCta")}
          label="Button"
          hint="Follow CTA"
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
        onReset={() => reset(ANIMATED_IMAGES_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_ANIMATED_IMAGES_STYLE}
      />
    </div>
  );
}

export default function SectionWithAnimatedImagesPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <SectionWithAnimatedImagesContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <SectionWithAnimatedImagesStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
