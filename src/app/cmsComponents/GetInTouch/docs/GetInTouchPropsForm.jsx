import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import GetInTouchContentForm from "./GetInTouchContentForm";
import {
  DEFAULT_GET_IN_TOUCH_STYLE,
  GET_IN_TOUCH_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function GetInTouchStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_GET_IN_TOUCH_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(GET_IN_TOUCH_STYLE_RESET_KEYS.layout)}
      >
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
        title="Content"
        onReset={() => reset(GET_IN_TOUCH_STYLE_RESET_KEYS.content)}
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
              id="getInTouch-title-weight"
              label="Title weight"
              value={style.titleFontWeight}
              onChange={(value) => update("titleFontWeight", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Avatar"
          hint="Round agent photo"
        />
        <InspectorSwitch
          checked={style.showLabel}
          onChange={() => toggle("showLabel")}
          label="Label"
        />
        {style.showLabel ? (
          <InspectorColor
            label="Label color"
            value={style.labelColor}
            onChange={(value) => update("labelColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showPhone}
          onChange={() => toggle("showPhone")}
          label="Phone"
        />
        {style.showPhone ? (
          <>
            <InspectorColor
              label="Phone color"
              value={style.phoneColor}
              onChange={(value) => update("phoneColor", value)}
            />
            <InspectorFontWeight
              id="getInTouch-phone-weight"
              label="Phone weight"
              value={style.phoneFontWeight}
              onChange={(value) => update("phoneFontWeight", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showHours}
          onChange={() => toggle("showHours")}
          label="Hours"
        />
        {style.showHours ? (
          <InspectorColor
            label="Hours color"
            value={style.hoursColor}
            onChange={(value) => update("hoursColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showNote}
          onChange={() => toggle("showNote")}
          label="Note"
        />
        {style.showNote ? (
          <InspectorColor
            label="Note color"
            value={style.noteColor}
            onChange={(value) => update("noteColor", value)}
          />
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function GetInTouchPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <GetInTouchContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<GetInTouchStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
