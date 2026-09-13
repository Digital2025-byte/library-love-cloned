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
import TabbedCardsSectionContentForm from "./TabbedCardsSectionContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_TABBED_CARDS_STYLE,
  SPACING_OPTIONS,
  TABBED_CARDS_STYLE_RESET_KEYS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function TabbedCardsSectionStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_TABBED_CARDS_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(TABBED_CARDS_STYLE_RESET_KEYS.layout)}
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
          checked={style.showTabs}
          onChange={() => toggle("showTabs")}
          label="Tabs"
          hint="Show the tab bar and filter cards"
        />
        {style.showTabs ? (
          <>
            <InspectorColor
              label="Track color"
              value={style.tabTrack}
              onChange={(value) => update("tabTrack", value)}
            />
            <InspectorColor
              label="Active background"
              value={style.tabActiveBg}
              onChange={(value) => update("tabActiveBg", value)}
            />
            <InspectorColor
              label="Active text"
              value={style.tabActiveText}
              onChange={(value) => update("tabActiveText", value)}
            />
            <InspectorColor
              label="Idle text"
              value={style.tabIdleText}
              onChange={(value) => update("tabIdleText", value)}
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
        onReset={() => reset(TABBED_CARDS_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Image"
          hint="Photo on each card"
        />
        <InspectorSwitch
          checked={style.showCardTitle}
          onChange={() => toggle("showCardTitle")}
          label="Name"
          hint="Card title under the photo"
        />
        {style.showCardTitle ? (
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
          checked={style.showCardDescription}
          onChange={() => toggle("showCardDescription")}
          label="Copy"
          hint="Card description"
        />
        {style.showCardDescription ? (
          <InspectorColor
            label="Copy color"
            value={style.bodyColor}
            onChange={(value) => update("bodyColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCardBg}
          onChange={() => toggle("showCardBg")}
          label="Card fill"
          hint="Background color on small screens"
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

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(TABBED_CARDS_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_TABBED_CARDS_STYLE}
      />
    </div>
  );
}

export default function TabbedCardsSectionPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <TabbedCardsSectionContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <TabbedCardsSectionStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
