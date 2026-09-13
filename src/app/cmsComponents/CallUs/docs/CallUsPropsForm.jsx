import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import CallUsContentForm from "./CallUsContentForm";
import {
  CALL_US_STYLE_RESET_KEYS,
  CARD_RADIUS_OPTIONS,
  DEFAULT_CALL_US_STYLE,
  SPACING_OPTIONS,
} from "../utils/style";

function CallUsStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_CALL_US_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(CALL_US_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the upper line"
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
          hint="Show the bottom line"
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
        <InspectorSwitch
          checked={style.showPhone}
          onChange={() => toggle("showPhone")}
          label="Phone"
          hint="Show the phone number"
        />
        {style.showPhone ? (
          <>
          <InspectorColor
            label="Phone color"
            value={style.phoneColor}
            onChange={(value) => update("phoneColor", value)}
          />
          <InspectorFontWeight
            id="phoneColor-weight"
            label="Phone weight"
            value={style.phoneFontWeight}
            onChange={(value) => update("phoneFontWeight", value)}
          />
        </>
        ) : null}
        <InspectorSwitch
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
          hint="Show the phone icon"
        />
        {style.showIcon ? (
          <>
            <InspectorColor
              label="Icon background"
              value={style.iconBg}
              onChange={(value) => update("iconBg", value)}
            />
            <InspectorColor
              label="Icon color"
              value={style.iconColor}
              onChange={(value) => update("iconColor", value)}
            />
          </>
        ) : null}
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
        title="Card"
        onReset={() => reset(CALL_US_STYLE_RESET_KEYS.card)}
      >
        <InspectorSwitch
          checked={style.showCardBg}
          onChange={() => toggle("showCardBg")}
          label="Card fill"
          hint="Background on the call block"
        />
        {style.showCardBg ? (
          <InspectorColor
            label="Card background"
            value={style.cardBg}
            onChange={(value) => update("cardBg", value)}
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
    </div>
  );
}

export default function CallUsPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <CallUsContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<CallUsStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
