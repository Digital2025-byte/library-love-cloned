import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import JourneySectionContentForm from "./JourneySectionContentForm";
import {
  COLUMNS_OPTIONS,
  DEFAULT_JOURNEY_SECTION_STYLE,
  JOURNEY_SECTION_STYLE_RESET_KEYS,
  PANEL_RADIUS_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function JourneySectionStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_JOURNEY_SECTION_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Header"
        onReset={() => reset(JOURNEY_SECTION_STYLE_RESET_KEYS.header)}
      >
        <InspectorSwitch
          checked={style.showHeader}
          onChange={() => toggle("showHeader")}
          label="Header"
          hint="Show the title block"
        />
        {style.showHeader ? (
          <>
            <InspectorSwitch
              checked={style.showTitle}
              onChange={() => toggle("showTitle")}
              label="Title"
              hint="Section heading"
            />
            {style.showTitle ? (
              <>
                <InspectorColor
                  label="Title color"
                  value={style.titleColor}
                  onChange={(value) => update("titleColor", value)}
                />
                <InspectorFontWeight
                  id="journey-title-weight"
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
              hint="Text under the heading"
            />
            {style.showSubtitle ? (
              <InspectorColor
                label="Subtitle color"
                value={style.subtitleColor}
                onChange={(value) => update("subtitleColor", value)}
              />
            ) : null}
            <InspectorChoose
              label="Alignment"
              name="titleAlign"
              value={style.titleAlign}
              options={TITLE_ALIGN_OPTIONS}
              onChange={(value) => update("titleAlign", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Layout"
        onReset={() => reset(JOURNEY_SECTION_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Section background"
          hint="Fill color behind the section"
        />
        {style.showSectionBg ? (
          <InspectorColor
            label="Section background"
            value={style.sectionBg}
            onChange={(value) => update("sectionBg", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showPanelBg}
          onChange={() => toggle("showPanelBg")}
          label="Panel fill"
          hint="Rounded card behind the steps"
        />
        {style.showPanelBg ? (
          <>
            <InspectorColor
              label="Panel background"
              value={style.panelBg}
              onChange={(value) => update("panelBg", value)}
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
          </>
        ) : null}
        <InspectorChoose
          label="Padding"
          name="sectionPadding"
          value={style.sectionPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("sectionPadding", value)}
        />
        <InspectorChoose
          label="Columns"
          name="columns"
          value={style.columns}
          options={COLUMNS_OPTIONS}
          onChange={(value) => update("columns", value)}
        />
        <InspectorChoose
          label="Gap"
          name="columnGap"
          value={style.columnGap}
          options={SPACING_OPTIONS}
          onChange={(value) => update("columnGap", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Steps"
        onReset={() => reset(JOURNEY_SECTION_STYLE_RESET_KEYS.steps)}
      >
        <InspectorSwitch
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
          hint="Icon badge on each step"
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
        <InspectorColor
          label="Step title color"
          value={style.stepTitleColor}
          onChange={(value) => update("stepTitleColor", value)}
        />
        <InspectorFontWeight
          id="journey-step-title-weight"
          label="Step title weight"
          value={style.stepTitleFontWeight}
          onChange={(value) => update("stepTitleFontWeight", value)}
        />
        <InspectorColor
          label="Link color"
          value={style.linkColor}
          onChange={(value) => update("linkColor", value)}
        />
      </InspectorSection>
    </div>
  );
}

export default function JourneySectionPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <JourneySectionContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <JourneySectionStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
