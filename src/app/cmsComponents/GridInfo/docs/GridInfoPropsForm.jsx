import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import GridInfoContentForm from "./GridInfoContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_GRID_INFO_STYLE,
  GRID_INFO_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function GridInfoStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_GRID_INFO_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(GRID_INFO_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the section heading"
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
          hint="Show text under the title"
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
          checked={style.showFilter}
          onChange={() => toggle("showFilter")}
          label="City filter"
          hint="Show city chips and filter the cards"
        />
        {style.showFilter ? (
          <>
            <InspectorColor
              label="Chip color"
              value={style.chipColor}
              onChange={(value) => update("chipColor", value)}
            />
            <InspectorColor
              label="Active text"
              value={style.chipActiveText}
              onChange={(value) => update("chipActiveText", value)}
            />
            <InspectorColor
              label="Idle background"
              value={style.chipIdleBg}
              onChange={(value) => update("chipIdleBg", value)}
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
        title="Items"
        onReset={() => reset(GRID_INFO_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showName}
          onChange={() => toggle("showName")}
          label="Name"
          hint="Branch name on each card"
        />
        {style.showName ? (
          <>
          <InspectorColor
            label="Name color"
            value={style.nameColor}
            onChange={(value) => update("nameColor", value)}
          />
          <InspectorFontWeight
            id="nameColor-weight"
            label="Name weight"
            value={style.nameFontWeight}
            onChange={(value) => update("nameFontWeight", value)}
          />
        </>
        ) : null}
        <InspectorSwitch
          checked={style.showAddress}
          onChange={() => toggle("showAddress")}
          label="Address"
          hint="Address row"
        />
        <InspectorSwitch
          checked={style.showPhone}
          onChange={() => toggle("showPhone")}
          label="Phone"
          hint="Phone row"
        />
        <InspectorSwitch
          checked={style.showEmail}
          onChange={() => toggle("showEmail")}
          label="Email"
          hint="Email row"
        />
        <InspectorSwitch
          checked={style.showHours}
          onChange={() => toggle("showHours")}
          label="Hours"
          hint="Working hours row"
        />
        {style.showAddress ||
        style.showPhone ||
        style.showEmail ||
        style.showHours ? (
          <>
            <InspectorColor
              label="Copy color"
              value={style.bodyColor}
              onChange={(value) => update("bodyColor", value)}
            />
            <InspectorColor
              label="Icon color"
              value={style.iconColor}
              onChange={(value) => update("iconColor", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showCardBg}
          onChange={() => toggle("showCardBg")}
          label="Card fill"
          hint="Background color on each card"
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
        <InspectorChoose
          label="Gap"
          name="cardGap"
          value={style.cardGap}
          options={SPACING_OPTIONS}
          onChange={(value) => update("cardGap", value)}
        />
      </InspectorSection>
    </div>
  );
}

export default function GridInfoPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <GridInfoContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<GridInfoStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
