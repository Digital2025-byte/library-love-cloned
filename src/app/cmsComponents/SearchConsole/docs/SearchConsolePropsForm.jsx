import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import SearchConsoleContentForm from "./SearchConsoleContentForm";
import {
  DEFAULT_SEARCH_CONSOLE_STYLE,
  GRADIENT_DIRECTION_OPTIONS,
  PANEL_RADIUS_OPTIONS,
  SEARCH_CONSOLE_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function SearchConsoleStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_SEARCH_CONSOLE_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(SEARCH_CONSOLE_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Fill color behind the panel"
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
          label="Panel padding"
          name="panelPadding"
          value={style.panelPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("panelPadding", value)}
        />
        <InspectorChoose
          label="Corners"
          name="panelRadius"
          value={style.panelRadius}
          options={PANEL_RADIUS_OPTIONS}
          onChange={(value) => update("panelRadius", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Panel"
        onReset={() => reset(SEARCH_CONSOLE_STYLE_RESET_KEYS.panel)}
      >
        <InspectorColor
          label="Gradient from"
          value={style.gradientFrom}
          onChange={(value) => update("gradientFrom", value)}
        />
        <InspectorColor
          label="Gradient to"
          value={style.gradientTo}
          onChange={(value) => update("gradientTo", value)}
        />
        <InspectorChoose
          label="Direction"
          name="gradientDirection"
          value={style.gradientDirection}
          options={GRADIENT_DIRECTION_OPTIONS}
          onChange={(value) => update("gradientDirection", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Search field"
        onReset={() => reset(SEARCH_CONSOLE_STYLE_RESET_KEYS.field)}
      >
        <InspectorSwitch
          checked={style.showLabel}
          onChange={() => toggle("showLabel")}
          label="Label"
          hint="Show the field label"
        />
        {style.showLabel ? (
          <>
            <InspectorColor
              label="Label color"
              value={style.labelColor}
              onChange={(value) => update("labelColor", value)}
            />
            <InspectorFontWeight
              id="searchConsole-label-weight"
              label="Label weight"
              value={style.labelFontWeight}
              onChange={(value) => update("labelFontWeight", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showSearchIcon}
          onChange={() => toggle("showSearchIcon")}
          label="Search icon"
          hint="Magnifier inside the field"
        />
        <InspectorColor
          label="Field background"
          value={style.inputBg}
          onChange={(value) => update("inputBg", value)}
        />
        <InspectorColor
          label="Field text"
          value={style.inputTextColor}
          onChange={(value) => update("inputTextColor", value)}
        />
        <InspectorSwitch
          checked={style.showSubmit}
          onChange={() => toggle("showSubmit")}
          label="Submit button"
          hint="Show the search button"
        />
        {style.showSubmit ? (
          <>
            <InspectorColor
              label="Button background"
              value={style.submitBg}
              onChange={(value) => update("submitBg", value)}
            />
            <InspectorColor
              label="Button text"
              value={style.submitTextColor}
              onChange={(value) => update("submitTextColor", value)}
            />
            <InspectorFontWeight
              id="searchConsole-submit-weight"
              label="Button weight"
              value={style.submitFontWeight}
              onChange={(value) => update("submitFontWeight", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Popular topics"
        onReset={() => reset(SEARCH_CONSOLE_STYLE_RESET_KEYS.popular)}
      >
        <InspectorSwitch
          checked={style.showPopular}
          onChange={() => toggle("showPopular")}
          label="Chip row"
          hint="Show popular topic chips"
        />
        {style.showPopular ? (
          <>
            <InspectorColor
              label="Row label color"
              value={style.popularLabelColor}
              onChange={(value) => update("popularLabelColor", value)}
            />
            <InspectorColor
              label="Chip text"
              value={style.chipTextColor}
              onChange={(value) => update("chipTextColor", value)}
            />
            <InspectorColor
              label="Chip border"
              value={style.chipBorderColor}
              onChange={(value) => update("chipBorderColor", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function SearchConsolePropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <SearchConsoleContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<SearchConsoleStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
