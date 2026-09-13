import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import OfficeDirectoryContentForm from "./OfficeDirectoryContentForm";
import {
  DEFAULT_OFFICE_DIRECTORY_STYLE,
  OFFICE_DIRECTORY_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function OfficeDirectoryStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_OFFICE_DIRECTORY_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(OFFICE_DIRECTORY_STYLE_RESET_KEYS.layout)}
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
        <InspectorColor
          label="Active tab color"
          value={style.activeTabColor}
          onChange={(value) => update("activeTabColor", value)}
        />
        <InspectorColor
          label="Inactive tab color"
          value={style.inactiveTabColor}
          onChange={(value) => update("inactiveTabColor", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Office rows"
        onReset={() => reset(OFFICE_DIRECTORY_STYLE_RESET_KEYS.items)}
      >
        <InspectorSwitch
          checked={style.showPin}
          onChange={() => toggle("showPin")}
          label="Pin badge"
        />
        {style.showPin ? (
          <>
            <InspectorColor
              label="Pin background"
              value={style.pinBg}
              onChange={(value) => update("pinBg", value)}
            />
            <InspectorColor
              label="Pin icon color"
              value={style.pinColor}
              onChange={(value) => update("pinColor", value)}
            />
            <InspectorSwitch
              checked={style.showDashedLine}
              onChange={() => toggle("showDashedLine")}
              label="Dashed timeline"
            />
            {style.showDashedLine ? (
              <InspectorColor
                label="Line color"
                value={style.lineColor}
                onChange={(value) => update("lineColor", value)}
              />
            ) : null}
          </>
        ) : null}
        <InspectorColor
          label="Name color"
          value={style.nameColor}
          onChange={(value) => update("nameColor", value)}
        />
        <InspectorFontWeight
          id="officeDir-name-weight"
          label="Name weight"
          value={style.nameFontWeight}
          onChange={(value) => update("nameFontWeight", value)}
        />
        <InspectorColor
          label="Detail color"
          value={style.rowColor}
          onChange={(value) => update("rowColor", value)}
        />
        <InspectorColor
          label="Divider color"
          value={style.dividerColor}
          onChange={(value) => update("dividerColor", value)}
        />
        <InspectorSwitch
          checked={style.showWeekend}
          onChange={() => toggle("showWeekend")}
          label="Weekend line"
        />
      </InspectorSection>

      <InspectorSection
        title="Buttons"
        onReset={() => reset(OFFICE_DIRECTORY_STYLE_RESET_KEYS.buttons)}
      >
        <InspectorSwitch
          checked={style.showButtons}
          onChange={() => toggle("showButtons")}
          label="Call / Email buttons"
        />
        {style.showButtons ? (
          <InspectorColor
            label="Button color"
            value={style.buttonColor}
            onChange={(value) => update("buttonColor", value)}
          />
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function OfficeDirectoryPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <OfficeDirectoryContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <OfficeDirectoryStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
