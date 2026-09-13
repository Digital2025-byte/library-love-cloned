import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import FlightFaresSectionContentForm from "./FlightFaresSectionContentForm";
import {
  CARD_RADIUS_OPTIONS,
  COLUMNS_ORDER_OPTIONS,
  DEFAULT_FLIGHT_FARES_STYLE,
  FLIGHT_FARES_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function FlightFaresSectionStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_FLIGHT_FARES_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(FLIGHT_FARES_STYLE_RESET_KEYS.layout)}
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
        <InspectorChoose
          label="Column order"
          name="columnsOrder"
          value={style.columnsOrder}
          options={COLUMNS_ORDER_OPTIONS}
          onChange={(value) => update("columnsOrder", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Items"
        onReset={() => reset(FLIGHT_FARES_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Image"
          hint="Photo on each card"
        />
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Wash"
          hint="Fade over the bottom of the photo"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Wash color"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showTopBadge}
          onChange={() => toggle("showTopBadge")}
          label="Top badge"
          hint="Corner badge on cards"
        />
        <InspectorSwitch
          checked={style.showExtraBadge}
          onChange={() => toggle("showExtraBadge")}
          label="Extra badge"
          hint="Secondary badge above the title"
        />
        {style.showTopBadge || style.showExtraBadge ? (
          <>
            <InspectorColor
              label="Badge color"
              value={style.badgeColor}
              onChange={(value) => update("badgeColor", value)}
            />
            <InspectorColor
              label="Badge text"
              value={style.badgeText}
              onChange={(value) => update("badgeText", value)}
            />
          <InspectorFontWeight
            id="badgeText-weight"
            label="Badge weight"
            value={style.badgeTextFontWeight}
            onChange={(value) => update("badgeTextFontWeight", value)}
          />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showItemTitle}
          onChange={() => toggle("showItemTitle")}
          label="Title"
          hint="Item title on each card"
        />
        {style.showItemTitle ? (
          <InspectorColor
            label="Title color"
            value={style.itemTitleColor}
            onChange={(value) => update("itemTitleColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showSubtitle}
          onChange={() => toggle("showSubtitle")}
          label="Subtitle"
          hint="Text under the title"
        />
        {style.showSubtitle ? (
          <>
          <InspectorColor
            label="Subtitle color"
            value={style.subtitleColor}
            onChange={(value) => update("subtitleColor", value)}
          />
          <InspectorFontWeight
            id="subtitleColor-weight"
            label="Subtitle weight"
            value={style.subtitleFontWeight}
            onChange={(value) => update("subtitleFontWeight", value)}
          />
        </>
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

export default function FlightFaresSectionPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <FlightFaresSectionContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <FlightFaresSectionStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
