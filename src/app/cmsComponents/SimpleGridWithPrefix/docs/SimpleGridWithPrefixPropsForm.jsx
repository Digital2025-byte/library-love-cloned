import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksStyleSection } from "@/app/cmsComponents/shared/backlinks";
import SimpleGridWithPrefixContentForm from "./SimpleGridWithPrefixContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_SIMPLE_GRID_STYLE,
  SIMPLE_GRID_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function SimpleGridWithPrefixStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_SIMPLE_GRID_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(SIMPLE_GRID_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the section heading"
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
        onReset={() => reset(SIMPLE_GRID_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
          hint="Channel icon on each card"
        />
        <InspectorSwitch
          checked={style.showPrefix}
          onChange={() => toggle("showPrefix")}
          label="Prefix"
          hint="Text before the channel name"
        />
        <InspectorSwitch
          checked={style.showChip}
          onChange={() => toggle("showChip")}
          label="Chip"
          hint="Follower count badge"
        />
        {style.showChip ? (
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
        <InspectorSwitch
          checked={style.showUserName}
          onChange={() => toggle("showUserName")}
          label="Handle"
          hint="Username under the title"
        />
        {style.showUserName ? (
          <InspectorColor
            label="Handle color"
            value={style.userNameColor}
            onChange={(value) => update("userNameColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showArrow}
          onChange={() => toggle("showArrow")}
          label="Arrow"
          hint="External-link arrow"
        />
        {style.showArrow ? (
          <InspectorColor
            label="Arrow color"
            value={style.arrowColor}
            onChange={(value) => update("arrowColor", value)}
          />
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
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(SIMPLE_GRID_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_SIMPLE_GRID_STYLE}
      />
    </div>
  );
}

export default function SimpleGridWithPrefixPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <SimpleGridWithPrefixContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <SimpleGridWithPrefixStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
