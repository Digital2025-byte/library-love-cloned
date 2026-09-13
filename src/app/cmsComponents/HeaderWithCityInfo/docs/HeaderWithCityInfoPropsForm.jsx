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
import { BackgroundImageControls } from "@/app/cmsComponents/shared/backgroundImage";
import HeaderWithCityInfoContentForm from "./HeaderWithCityInfoContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_HEADER_WITH_CITY_INFO_STYLE,
  HEADER_WITH_CITY_INFO_STYLE_RESET_KEYS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function HeaderWithCityInfoStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_HEADER_WITH_CITY_INFO_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(HEADER_WITH_CITY_INFO_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the city heading"
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
          label="Country"
          hint="Show the country name"
        />
        {style.showDescription ? (
          <InspectorColor
            label="Country color"
            value={style.descriptionColor}
            onChange={(value) => update("descriptionColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCityCard}
          onChange={() => toggle("showCityCard")}
          label="City card"
          hint="Show the info card on the right"
        />
      </InspectorSection>

      <InspectorSection
        title="Banner"
        onReset={() => reset(HEADER_WITH_CITY_INFO_STYLE_RESET_KEYS.banner)}
      >
        <InspectorSwitch
          checked={style.showHeroImage}
          onChange={() => toggle("showHeroImage")}
          label="Image"
          hint="Background photo"
        />
        <BackgroundImageControls
          style={style}
          onChange={onChange}
          visible={Boolean(style.showHeroImage)}
          idPrefix="header-with-city-info"
        />
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Wash"
          hint="Colored fade over the photo"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Wash color"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
      </InspectorSection>

      {style.showCityCard ? (
        <InspectorSection
          title="Card"
          onReset={() => reset(HEADER_WITH_CITY_INFO_STYLE_RESET_KEYS.card)}
        >
          <InspectorSwitch
            checked={style.showCardHeading}
            onChange={() => toggle("showCardHeading")}
            label="Heading"
            hint="Card title"
          />
          {style.showCardHeading ? (
            <InspectorColor
              label="Heading color"
              value={style.cardHeadingColor}
              onChange={(value) => update("cardHeadingColor", value)}
            />
          ) : null}
          <InspectorSwitch
            checked={style.showCardDescription}
            onChange={() => toggle("showCardDescription")}
            label="Copy"
            hint="Text under the card title"
          />
          <InspectorColor
            label="Tile label"
            value={style.tileLabelColor}
            onChange={(value) => update("tileLabelColor", value)}
          />
          <InspectorColor
            label="Tile value"
            value={style.tileValueColor}
            onChange={(value) => update("tileValueColor", value)}
          />
          <InspectorSwitch
            checked={style.showNextFlight}
            onChange={() => toggle("showNextFlight")}
            label="Next flight"
            hint="Footer row on the card"
          />
          {style.showNextFlight ? (
            <>
              <InspectorColor
                label="Next flight color"
                value={style.nextFlightColor}
                onChange={(value) => update("nextFlightColor", value)}
              />
              <InspectorFontWeight
                id="nextFlightColor-weight"
                label="Next flight weight"
                value={style.nextFlightFontWeight}
                onChange={(value) => update("nextFlightFontWeight", value)}
              />
            </>
          ) : null}
          {style.showCardDescription || style.showNextFlight ? (
            <InspectorColor
              label="Copy color"
              value={style.cardBodyColor}
              onChange={(value) => update("cardBodyColor", value)}
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
      ) : null}

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(HEADER_WITH_CITY_INFO_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_HEADER_WITH_CITY_INFO_STYLE}
      />
    </div>
  );
}

export default function HeaderWithCityInfoPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <HeaderWithCityInfoContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <HeaderWithCityInfoStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
