import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSelect,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksStyleSection } from "@/app/cmsComponents/shared/backlinks";
import OppositeScrollContentForm from "./OppositeScrollContentForm";
import {
  CARD_RADIUS_OPTIONS,
  CARD_SIZE_OPTIONS,
  DEFAULT_OPPOSITE_SCROLL_STYLE,
  OPPOSITE_SCROLL_STYLE_RESET_KEYS,
  SPEED_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function OppositeScrollStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_OPPOSITE_SCROLL_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(OPPOSITE_SCROLL_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitleDescription}
          onChange={() => toggle("showTitleDescription")}
          label="Title"
          hint="Show the section heading"
        />
        {style.showTitleDescription ? (
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
          checked={style.showExploreButton}
          onChange={() => toggle("showExploreButton")}
          label="Explore"
          hint="Round CTA over the marquees"
        />
        {style.showExploreButton ? (
          <>
            <InspectorColor
              label="Background"
              value={style.buttonBg}
              onChange={(value) => update("buttonBg", value)}
            />
            <InspectorColor
              label="Text"
              value={style.buttonColor}
              onChange={(value) => update("buttonColor", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Background"
          hint="Show the section background color"
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
        onReset={() => reset(OPPOSITE_SCROLL_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showCardTitles}
          onChange={() => toggle("showCardTitles")}
          label="Names"
          hint="Title on each destination card"
        />
        {style.showCardTitles ? (
          <InspectorColor
            label="Title color"
            value={style.cardTitleColor}
            onChange={(value) => update("cardTitleColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Gradient"
          hint="Fade behind the card title"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Gradient color"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.dimOnHover}
          onChange={() => toggle("dimOnHover")}
          label="Dim on hover"
          hint="Darken cards when the section is hovered"
        />
        <InspectorChoose
          label="Size"
          name="cardSize"
          value={style.cardSize}
          options={CARD_SIZE_OPTIONS}
          onChange={(value) => update("cardSize", value)}
        />
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
        <InspectorChoose
          label="Row gap"
          name="rowGap"
          value={style.rowGap}
          options={SPACING_OPTIONS}
          onChange={(value) => update("rowGap", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Motion"
        onReset={() => reset(OPPOSITE_SCROLL_STYLE_RESET_KEYS.motion)}
      >
        <InspectorSwitch
          checked={style.pauseOnHover}
          onChange={() => toggle("pauseOnHover")}
          label="Pause on hover"
          hint="Stop the marquee while the pointer is over it"
        />
        <InspectorSwitch
          checked={style.reverseRows}
          onChange={() => toggle("reverseRows")}
          label="Reverse"
          hint="Swap the scroll direction of each row"
        />
        <InspectorSelect
          id="opposite-scroll-speed"
          label="Speed"
          value={style.speed}
          options={SPEED_OPTIONS}
          onChange={(value) => update("speed", value)}
        />
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(OPPOSITE_SCROLL_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_OPPOSITE_SCROLL_STYLE}
      />
    </div>
  );
}

export default function OppositeScrollPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <OppositeScrollContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <OppositeScrollStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
