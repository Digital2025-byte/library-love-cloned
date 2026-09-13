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
import CardsCarouselFillImageContentForm from "./CardsCarouselFillImageContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_FILL_IMAGE_STYLE,
  FILL_IMAGE_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function CardsCarouselFillImageStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_FILL_IMAGE_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(FILL_IMAGE_STYLE_RESET_KEYS.layout)}
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
          checked={style.showArrows}
          onChange={() => toggle("showArrows")}
          label="Arrows"
          hint="Previous / next arrow controls"
        />
        {style.showArrows ? (
          <InspectorColor
            label="Arrow color"
            value={style.navColor}
            onChange={(value) => update("navColor", value)}
          />
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
        onReset={() => reset(FILL_IMAGE_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showCardImage}
          onChange={() => toggle("showCardImage")}
          label="Image"
          hint="Photo filling each card"
        />
        <InspectorSwitch
          checked={style.showCardTitle}
          onChange={() => toggle("showCardTitle")}
          label="Names"
          hint="Title on each card"
        />
        {style.showCardTitle ? (
          <InspectorColor
            label="Title color"
            value={style.cardTitleColor}
            onChange={(value) => update("cardTitleColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showCardDescription}
          onChange={() => toggle("showCardDescription")}
          label="Description"
          hint="Body text on each card"
        />
        {style.showCardDescription ? (
          <InspectorColor
            label="Body color"
            value={style.cardBodyColor}
            onChange={(value) => update("cardBodyColor", value)}
          />
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
        onReset={() => reset(FILL_IMAGE_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="CTA"
          hint="Learn more button on each card"
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
            <InspectorColor
              label="On fill"
              value={style.buttonOnFill}
              onChange={(value) => update("buttonOnFill", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(FILL_IMAGE_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_FILL_IMAGE_STYLE}
      />
    </div>
  );
}

export default function CardsCarouselFillImagePropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <CardsCarouselFillImageContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <CardsCarouselFillImageStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
