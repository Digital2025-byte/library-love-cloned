import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import TrackRequestContentForm from "./TrackRequestContentForm";
import {
  DEFAULT_TRACK_REQUEST_STYLE,
  SPACING_OPTIONS,
  TRACK_REQUEST_STYLE_RESET_KEYS,
} from "../utils/style";

function TrackRequestStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_TRACK_REQUEST_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(TRACK_REQUEST_STYLE_RESET_KEYS.layout)}
      >
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
        <InspectorChoose
          label="Padding"
          name="sectionPadding"
          value={style.sectionPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("sectionPadding", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Text"
        onReset={() => reset(TRACK_REQUEST_STYLE_RESET_KEYS.text)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
        />
        {style.showTitle ? (
          <>
            <InspectorColor
              label="Title color"
              value={style.titleColor}
              onChange={(value) => update("titleColor", value)}
            />
            <InspectorFontWeight
              id="trackRequest-title-weight"
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
        />
        {style.showSubtitle ? (
          <InspectorColor
            label="Subtitle color"
            value={style.subtitleColor}
            onChange={(value) => update("subtitleColor", value)}
          />
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(TRACK_REQUEST_STYLE_RESET_KEYS.button)}
      >
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
        <InspectorFontWeight
          id="trackRequest-button-weight"
          label="Text weight"
          value={style.buttonFontWeight}
          onChange={(value) => update("buttonFontWeight", value)}
        />
      </InspectorSection>
    </div>
  );
}

export default function TrackRequestPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <TrackRequestContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<TrackRequestStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
