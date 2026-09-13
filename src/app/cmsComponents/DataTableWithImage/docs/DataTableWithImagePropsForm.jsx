import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import DataTableWithImageContentForm from "./DataTableWithImageContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DATA_TABLE_WITH_IMAGE_STYLE_RESET_KEYS,
  DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function DataTableWithImageStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(DATA_TABLE_WITH_IMAGE_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the heading"
        />
        {style.showTitle ? (
          <>
            <InspectorChoose
              label="Alignment"
              name="titleAlign"
              value={style.titleAlign}
              options={TITLE_ALIGN_OPTIONS}
              onChange={(value) => update("titleAlign", value)}
            />
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
          hint="Show the note under the table"
        />
        {style.showDescription ? (
          <InspectorColor
            label="Note color"
            value={style.descriptionColor}
            onChange={(value) => update("descriptionColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showTable}
          onChange={() => toggle("showTable")}
          label="Table"
          hint="Show the data table"
        />
        {style.showTable ? (
          <>
            <InspectorChoose
              label="Corners"
              name="tableRadius"
              value={style.tableRadius}
              options={CARD_RADIUS_OPTIONS}
              onChange={(value) => update("tableRadius", value)}
            />
            <InspectorColor
              label="Table background"
              value={style.tableBg}
              onChange={(value) => update("tableBg", value)}
            />
            <InspectorColor
              label="Header color"
              value={style.headerColor}
              onChange={(value) => update("headerColor", value)}
            />
            <InspectorColor
              label="Cell color"
              value={style.cellColor}
              onChange={(value) => update("cellColor", value)}
            />
            <InspectorColor
              label="Stripe color"
              value={style.stripeColor}
              onChange={(value) => update("stripeColor", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Image"
          hint="Show the illustration"
        />
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
    </div>
  );
}

export default function DataTableWithImagePropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <DataTableWithImageContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <DataTableWithImageStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
