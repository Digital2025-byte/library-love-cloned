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
import DestinationsCitiesContentForm from "./DestinationsCitiesContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_DESTINATIONS_CITIES_STYLE,
  DESTINATIONS_CITIES_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function DestinationsCitiesStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_DESTINATIONS_CITIES_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(DESTINATIONS_CITIES_STYLE_RESET_KEYS.layout)}
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
        onReset={() => reset(DESTINATIONS_CITIES_STYLE_RESET_KEYS.cards)}
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
          hint="City name on the card"
        />
        {style.showCity ? (
          <InspectorColor
            label="City color"
            value={style.cityColor}
            onChange={(value) => update("cityColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showOrigin}
          onChange={() => toggle("showOrigin")}
          label="Origin"
          hint="From badge next to the city"
        />
        {style.showOrigin ? (
          <>
            <InspectorColor
              label="Origin color"
              value={style.originColor}
              onChange={(value) => update("originColor", value)}
            />
            <InspectorColor
              label="Origin background"
              value={style.originBg}
              onChange={(value) => update("originBg", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showNew}
          onChange={() => toggle("showNew")}
          label="New"
          hint="New route badge"
        />
        <InspectorSwitch
          checked={style.showFlights}
          onChange={() => toggle("showFlights")}
          label="Flights"
          hint="Flights per week"
        />
        <InspectorSwitch
          checked={style.showDuration}
          onChange={() => toggle("showDuration")}
          label="Duration"
          hint="Flight duration"
        />
        {style.showNew || style.showFlights || style.showDuration ? (
          <InspectorColor
            label="Meta color"
            value={style.metaColor}
            onChange={(value) => update("metaColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCardDescription}
          onChange={() => toggle("showCardDescription")}
          label="Description"
          hint="Body text on each card"
        />
        {style.showCardDescription ? (
          <>
          <InspectorColor
            label="Body color"
            value={style.bodyColor}
            onChange={(value) => update("bodyColor", value)}
          />
          <InspectorFontWeight
            id="bodyColor-weight"
            label="Body weight"
            value={style.bodyFontWeight}
            onChange={(value) => update("bodyFontWeight", value)}
          />
        </>
        ) : null}
        <InspectorSwitch
          checked={style.showPanel}
          onChange={() => toggle("showPanel")}
          label="Panel"
          hint="Glass panel over the bottom of the card"
        />
        {style.showPanel ? (
          <InspectorColor
            label="Panel color"
            value={style.panelBg}
            onChange={(value) => update("panelBg", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showInactiveDim}
          onChange={() => toggle("showInactiveDim")}
          label="Dim stacked"
          hint="Darken cards that are not in front"
        />
        {style.showInactiveDim ? (
          <InspectorColor
            label="Stack dim"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
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
        title="Button"
        onReset={() => reset(DESTINATIONS_CITIES_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="CTA"
          hint="Check flights button on each card"
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

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(DESTINATIONS_CITIES_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_DESTINATIONS_CITIES_STYLE}
      />
    </div>
  );
}

export default function DestinationsCitiesPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <DestinationsCitiesContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <DestinationsCitiesStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
