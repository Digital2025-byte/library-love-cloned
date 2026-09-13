import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import HelpCategoriesContentForm from "./HelpCategoriesContentForm";
import {
  CARD_RADIUS_OPTIONS,
  COLUMNS_OPTIONS,
  DEFAULT_HELP_CATEGORIES_STYLE,
  HELP_CATEGORIES_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function HelpCategoriesStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_HELP_CATEGORIES_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Header"
        onReset={() => reset(HELP_CATEGORIES_STYLE_RESET_KEYS.header)}
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
              checked={style.showSectionTitle}
              onChange={() => toggle("showSectionTitle")}
              label="Title"
              hint="Section heading"
            />
            {style.showSectionTitle ? (
              <>
                <InspectorColor
                  label="Title color"
                  value={style.sectionTitleColor}
                  onChange={(value) => update("sectionTitleColor", value)}
                />
                <InspectorFontWeight
                  id="helpCategories-title-weight"
                  label="Title weight"
                  value={style.sectionTitleFontWeight}
                  onChange={(value) => update("sectionTitleFontWeight", value)}
                />
              </>
            ) : null}
            <InspectorSwitch
              checked={style.showSectionSubtitle}
              onChange={() => toggle("showSectionSubtitle")}
              label="Subtitle"
              hint="Text under the heading"
            />
            {style.showSectionSubtitle ? (
              <InspectorColor
                label="Subtitle color"
                value={style.sectionSubtitleColor}
                onChange={(value) => update("sectionSubtitleColor", value)}
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
        onReset={() => reset(HELP_CATEGORIES_STYLE_RESET_KEYS.layout)}
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
      </InspectorSection>

      <InspectorSection
        title="Cards"
        onReset={() => reset(HELP_CATEGORIES_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
          hint="Icon badge on each card"
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
          checked={style.showCardTitle}
          onChange={() => toggle("showCardTitle")}
          label="Card title"
          hint="Heading on each card"
        />
        {style.showCardTitle ? (
          <>
            <InspectorColor
              label="Card title color"
              value={style.cardTitleColor}
              onChange={(value) => update("cardTitleColor", value)}
            />
            <InspectorFontWeight
              id="helpCategories-card-title-weight"
              label="Card title weight"
              value={style.cardTitleFontWeight}
              onChange={(value) => update("cardTitleFontWeight", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showCardDescription}
          onChange={() => toggle("showCardDescription")}
          label="Card description"
          hint="Copy on each card"
        />
        {style.showCardDescription ? (
          <InspectorColor
            label="Description color"
            value={style.cardDescriptionColor}
            onChange={(value) => update("cardDescriptionColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showArrow}
          onChange={() => toggle("showArrow")}
          label="Arrow"
          hint="Arrow badge on each card"
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
      </InspectorSection>
    </div>
  );
}

export default function HelpCategoriesPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <HelpCategoriesContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <HelpCategoriesStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
