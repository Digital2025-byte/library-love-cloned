import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import LocationDirectoryContentForm from "./LocationDirectoryContentForm";
import {
  CARD_RADIUS_OPTIONS,
  COLUMNS_OPTIONS,
  DEFAULT_LOCATION_DIRECTORY_STYLE,
  LOCATION_DIRECTORY_STYLE_RESET_KEYS,
  MAP_HEIGHT_OPTIONS,
  MAP_SIDE_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function LocationDirectoryStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_LOCATION_DIRECTORY_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Header"
        onReset={() => reset(LOCATION_DIRECTORY_STYLE_RESET_KEYS.header)}
      >
        <InspectorSwitch
          checked={style.showHeader}
          onChange={() => toggle("showHeader")}
          label="Header"
        />
        {style.showHeader ? (
          <>
            <InspectorSwitch
              checked={style.showTitle}
              onChange={() => toggle("showTitle")}
              label="Title"
            />
            {style.showTitle ? (
              <>
                <InspectorColor
                  label="Title color"
                  value={style.titleColor}
                  onChange={(value) => update("titleColor", value)}
                />
                <InspectorFontWeight
                  id="locationDir-title-weight"
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
        onReset={() => reset(LOCATION_DIRECTORY_STYLE_RESET_KEYS.layout)}
      >
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
          label="Active tab color"
          value={style.activeTabColor}
          onChange={(value) => update("activeTabColor", value)}
        />
        <InspectorColor
          label="Inactive tab color"
          value={style.inactiveTabColor}
          onChange={(value) => update("inactiveTabColor", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Location cards"
        onReset={() => reset(LOCATION_DIRECTORY_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showCity}
          onChange={() => toggle("showCity")}
          label="City"
        />
        <InspectorSwitch
          checked={style.showAddress}
          onChange={() => toggle("showAddress")}
          label="Address"
        />
        <InspectorSwitch
          checked={style.showPhone}
          onChange={() => toggle("showPhone")}
          label="Phone"
        />
        <InspectorSwitch
          checked={style.showEmail}
          onChange={() => toggle("showEmail")}
          label="Email"
        />
        <InspectorSwitch
          checked={style.showHours}
          onChange={() => toggle("showHours")}
          label="Hours"
        />
        <InspectorColor
          label="Name color"
          value={style.nameColor}
          onChange={(value) => update("nameColor", value)}
        />
        <InspectorFontWeight
          id="locationDir-name-weight"
          label="Name weight"
          value={style.nameFontWeight}
          onChange={(value) => update("nameFontWeight", value)}
        />
        <InspectorColor
          label="Detail color"
          value={style.metaColor}
          onChange={(value) => update("metaColor", value)}
        />
        <InspectorColor
          label="Link color"
          value={style.linkColor}
          onChange={(value) => update("linkColor", value)}
        />
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

      <InspectorSection
        title="Map"
        onReset={() => reset(LOCATION_DIRECTORY_STYLE_RESET_KEYS.map)}
      >
        <InspectorSwitch
          checked={style.showMap}
          onChange={() => toggle("showMap")}
          label="Live map"
          hint="Show a Leaflet map beside the cards (needs coordinates)"
        />
        {style.showMap ? (
          <>
            <InspectorChoose
              label="Map side"
              name="mapSide"
              value={style.mapSide}
              options={MAP_SIDE_OPTIONS}
              onChange={(value) => update("mapSide", value)}
            />
            <InspectorChoose
              label="Map height"
              name="mapHeight"
              value={style.mapHeight}
              options={MAP_HEIGHT_OPTIONS}
              onChange={(value) => update("mapHeight", value)}
            />
            <InspectorChoose
              label="Map corners"
              name="mapRadius"
              value={style.mapRadius}
              options={CARD_RADIUS_OPTIONS}
              onChange={(value) => update("mapRadius", value)}
            />
            <InspectorColor
              label="Pin color"
              value={style.mapPinColor}
              onChange={(value) => update("mapPinColor", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function LocationDirectoryPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <LocationDirectoryContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <LocationDirectoryStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
