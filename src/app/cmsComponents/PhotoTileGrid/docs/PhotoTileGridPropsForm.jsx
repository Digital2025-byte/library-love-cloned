import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import PhotoTileGridContentForm from "./PhotoTileGridContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_PHOTO_TILE_GRID_STYLE,
  PHOTO_TILE_GRID_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function PhotoTileGridStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_PHOTO_TILE_GRID_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(PHOTO_TILE_GRID_STYLE_RESET_KEYS.layout)}
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
      </InspectorSection>

      <InspectorSection
        title="Items"
        onReset={() => reset(PHOTO_TILE_GRID_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showCardImage}
          onChange={() => toggle("showCardImage")}
          label="Image"
          hint="Photo filling each destination card"
        />
        <InspectorSwitch
          checked={style.showCity}
          onChange={() => toggle("showCity")}
          label="City"
          hint="City name on each card"
        />
        {style.showCity ? (
          <InspectorColor
            label="City color"
            value={style.cityColor}
            onChange={(value) => update("cityColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showIata}
          onChange={() => toggle("showIata")}
          label="IATA"
          hint="Airport code next to the city"
        />
        <InspectorSwitch
          checked={style.showCountry}
          onChange={() => toggle("showCountry")}
          label="Country"
          hint="Country name under the button"
        />
        {style.showCountry ? (
          <>
          <InspectorColor
            label="Country color"
            value={style.countryColor}
            onChange={(value) => update("countryColor", value)}
          />
          <InspectorFontWeight
            id="countryColor-weight"
            label="Country weight"
            value={style.countryFontWeight}
            onChange={(value) => update("countryFontWeight", value)}
          />
        </>
        ) : null}
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Gradient"
          hint="Fade behind the card copy"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Gradient color"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showHoverDim}
          onChange={() => toggle("showHoverDim")}
          label="Dim on hover"
          hint="Darken the image when hovered"
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
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(PHOTO_TILE_GRID_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="CTA"
          hint="Discover button on each card"
        />
        {style.showButton ? (
          <>
            <InspectorColor
              label="Background"
              value={style.buttonBg}
              onChange={(value) => update("buttonBg", value)}
            />
            <InspectorColor
              label="Text"
              value={style.buttonText}
              onChange={(value) => update("buttonText", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function PhotoTileGridPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <PhotoTileGridContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<PhotoTileGridStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
