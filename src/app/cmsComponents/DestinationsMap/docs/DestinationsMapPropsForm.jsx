import {
  InspectorChoose,
  InspectorColor,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import DestinationsMapContentForm from "./DestinationsMapContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_DESTINATIONS_MAP_STYLE,
  DESTINATIONS_MAP_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
} from "../utils/style";

function DestinationsMapStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_DESTINATIONS_MAP_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(DESTINATIONS_MAP_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showSearch}
          onChange={() => toggle("showSearch")}
          label="Search"
          hint="From / To search bar"
        />
        <InspectorSwitch
          checked={style.showFilters}
          onChange={() => toggle("showFilters")}
          label="Filters"
          hint="New routes and network toggles"
        />
        {style.showFilters ? (
          <>
            <InspectorColor
              label="Chip background"
              value={style.filterBg}
              onChange={(value) => update("filterBg", value)}
            />
            <InspectorColor
              label="Chip text"
              value={style.filterText}
              onChange={(value) => update("filterText", value)}
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
          label="Map corners"
          name="mapRadius"
          value={style.mapRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("mapRadius", value)}
        />
      </InspectorSection>

      {style.showSearch ? (
        <InspectorSection
          title="Search"
          onReset={() => reset(DESTINATIONS_MAP_STYLE_RESET_KEYS.search)}
        >
          <InspectorSwitch
            checked={style.showReset}
            onChange={() => toggle("showReset")}
            label="Reset"
            hint="Clear From / To after a selection"
          />
          <InspectorSwitch
            checked={style.showBookNow}
            onChange={() => toggle("showBookNow")}
            label="Book now"
            hint="CTA after both cities are selected"
          />
          {style.showBookNow ? (
            <>
              <InspectorColor
                label="Book background"
                value={style.bookBg}
                onChange={(value) => update("bookBg", value)}
              />
              <InspectorColor
                label="Book text"
                value={style.bookText}
                onChange={(value) => update("bookText", value)}
              />
            </>
          ) : null}
          <InspectorColor
            label="Search background"
            value={style.searchBg}
            onChange={(value) => update("searchBg", value)}
          />
        </InspectorSection>
      ) : null}
    </div>
  );
}

export default function DestinationsMapPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <DestinationsMapContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <DestinationsMapStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
