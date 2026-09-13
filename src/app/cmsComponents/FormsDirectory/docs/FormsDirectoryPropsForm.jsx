import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import FormsDirectoryContentForm from "./FormsDirectoryContentForm";
import {
  CARD_RADIUS_OPTIONS,
  COLUMNS_OPTIONS,
  DEFAULT_FORMS_DIRECTORY_STYLE,
  FORMS_DIRECTORY_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function FormsDirectoryStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_FORMS_DIRECTORY_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(FORMS_DIRECTORY_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Active tab title"
        />
        {style.showTitle ? (
          <>
            <InspectorColor
              label="Title color"
              value={style.titleColor}
              onChange={(value) => update("titleColor", value)}
            />
            <InspectorFontWeight
              id="formsDir-title-weight"
              label="Title weight"
              value={style.titleFontWeight}
              onChange={(value) => update("titleFontWeight", value)}
            />
          </>
        ) : null}
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
        <InspectorChoose
          label="Columns"
          name="columns"
          value={style.columns}
          options={COLUMNS_OPTIONS}
          onChange={(value) => update("columns", value)}
        />
        <InspectorChoose
          label="Gap"
          name="cardGap"
          value={style.cardGap}
          options={SPACING_OPTIONS}
          onChange={(value) => update("cardGap", value)}
        />
        <InspectorColor
          label="Active tab background"
          value={style.tabActiveBg}
          onChange={(value) => update("tabActiveBg", value)}
        />
        <InspectorColor
          label="Active tab text"
          value={style.tabActiveText}
          onChange={(value) => update("tabActiveText", value)}
        />
        <InspectorColor
          label="Inactive tab background"
          value={style.tabInactiveBg}
          onChange={(value) => update("tabInactiveBg", value)}
        />
        <InspectorColor
          label="Inactive tab text"
          value={style.tabInactiveText}
          onChange={(value) => update("tabInactiveText", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Form cards"
        onReset={() => reset(FORMS_DIRECTORY_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
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
          checked={style.showCategory}
          onChange={() => toggle("showCategory")}
          label="Category"
        />
        {style.showCategory ? (
          <InspectorColor
            label="Category color"
            value={style.categoryColor}
            onChange={(value) => update("categoryColor", value)}
          />
        ) : null}
        <InspectorColor
          label="Title color"
          value={style.cardTitleColor}
          onChange={(value) => update("cardTitleColor", value)}
        />
        <InspectorFontWeight
          id="formsDir-card-title-weight"
          label="Title weight"
          value={style.cardTitleFontWeight}
          onChange={(value) => update("cardTitleFontWeight", value)}
        />
        <InspectorSwitch
          checked={style.showDescription}
          onChange={() => toggle("showDescription")}
          label="Description"
        />
        {style.showDescription ? (
          <InspectorColor
            label="Description color"
            value={style.descriptionColor}
            onChange={(value) => update("descriptionColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showArrow}
          onChange={() => toggle("showArrow")}
          label="Arrow"
        />
        {style.showArrow ? (
          <>
            <InspectorColor
              label="Arrow background"
              value={style.arrowBg}
              onChange={(value) => update("arrowBg", value)}
            />
            <InspectorColor
              label="Arrow color"
              value={style.arrowColor}
              onChange={(value) => update("arrowColor", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showCardBg}
          onChange={() => toggle("showCardBg")}
          label="Card fill"
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

export default function FormsDirectoryPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <FormsDirectoryContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<FormsDirectoryStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
