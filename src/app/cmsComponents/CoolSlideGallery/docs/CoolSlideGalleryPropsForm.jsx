import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import CoolSlideGalleryContentForm from "./CoolSlideGalleryContentForm";
import {
  CARD_RADIUS_OPTIONS,
  COOL_SLIDE_GALLERY_STYLE_RESET_KEYS,
  DEFAULT_COOL_SLIDE_GALLERY_STYLE,
  OVERLAY_POSITION_OPTIONS,
} from "../utils/style";

function CoolSlideGalleryStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_COOL_SLIDE_GALLERY_STYLE, keys)
    );
  const showOverlay =
    style.showTitle || style.showSubtitle || style.showBadge;
  const showControls = style.showArrows || style.showDots;

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(COOL_SLIDE_GALLERY_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color behind the whole component"
        />
        {style.showSectionBg ? (
          <InspectorColor
            label="Section background"
            value={style.sectionBg}
            onChange={(value) => update("sectionBg", value)}
          />
        ) : null}
        <InspectorChoose
          label="Corners"
          name="cardRadius"
          value={style.cardRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("cardRadius", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Controls"
        onReset={() => reset(COOL_SLIDE_GALLERY_STYLE_RESET_KEYS.controls)}
      >
        <InspectorSwitch
          checked={style.showArrows}
          onChange={() => toggle("showArrows")}
          label="Arrows"
          hint="Previous and next controls"
        />
        {style.showArrows ? (
          <InspectorColor
            label="Arrows color"
            value={style.arrowsColor}
            onChange={(value) => update("arrowsColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showDots}
          onChange={() => toggle("showDots")}
          label="Dots"
          hint="Slide indicators under the gallery"
        />
        {style.showDots ? (
          <InspectorColor
            label="Dots color"
            value={style.dotsColor}
            onChange={(value) => update("dotsColor", value)}
          />
        ) : null}
        {showControls ? (
          <InspectorColor
            label="Controls background"
            value={style.controlsBg}
            onChange={(value) => update("controlsBg", value)}
          />
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Overlay"
        onReset={() => reset(COOL_SLIDE_GALLERY_STYLE_RESET_KEYS.overlay)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Title on each slide"
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
          checked={style.showSubtitle}
          onChange={() => toggle("showSubtitle")}
          label="Subtitle"
          hint="Subtitle under the title"
        />
        {style.showSubtitle ? (
          <>
          <InspectorColor
            label="Subtitle color"
            value={style.subtitleColor}
            onChange={(value) => update("subtitleColor", value)}
          />
          <InspectorFontWeight
            id="subtitleColor-weight"
            label="Subtitle weight"
            value={style.subtitleFontWeight}
            onChange={(value) => update("subtitleFontWeight", value)}
          />
        </>
        ) : null}
        <InspectorSwitch
          checked={style.showBadge}
          onChange={() => toggle("showBadge")}
          label="Chip"
          hint="Small label above the title"
        />
        {style.showBadge ? (
          <>
            <InspectorColor
              label="Chip background"
              value={style.chipBg}
              onChange={(value) => update("chipBg", value)}
            />
            <InspectorColor
              label="Chip text"
              value={style.chipText}
              onChange={(value) => update("chipText", value)}
            />
          <InspectorFontWeight
            id="chipText-weight"
            label="Chip text weight"
            value={style.chipTextFontWeight}
            onChange={(value) => update("chipTextFontWeight", value)}
          />
          </>
        ) : null}
        {showOverlay ? (
          <>
            <InspectorChoose
              label="Position"
              name="overlayPosition"
              value={style.overlayPosition}
              options={OVERLAY_POSITION_OPTIONS}
              onChange={(value) => update("overlayPosition", value)}
            />
            <InspectorColor
              label="Gradient color"
              value={style.overlayColor}
              onChange={(value) => update("overlayColor", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function CoolSlideGalleryPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <CoolSlideGalleryContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <CoolSlideGalleryStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
