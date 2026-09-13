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
import ServiceBenefitsListContentForm from "./ServiceBenefitsListContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_SERVICE_BENEFITS_STYLE,
  SERVICE_BENEFITS_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function ServiceBenefitsListStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_SERVICE_BENEFITS_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(SERVICE_BENEFITS_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the heading"
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
          hint="Show text under each benefit title"
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
        onReset={() => reset(SERVICE_BENEFITS_STYLE_RESET_KEYS.items)}
      >
        <InspectorSwitch
          checked={style.showIcons}
          onChange={() => toggle("showIcons")}
          label="Icons"
          hint="Circle icons beside each benefit"
        />
        {style.showIcons ? (
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
        <InspectorColor
          label="Item title"
          value={style.itemTitleColor}
          onChange={(value) => update("itemTitleColor", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Banner"
        onReset={() => reset(SERVICE_BENEFITS_STYLE_RESET_KEYS.banner)}
      >
        <InspectorSwitch
          checked={style.showBackgroundImage}
          onChange={() => toggle("showBackgroundImage")}
          label="Photo"
          hint="Background photo on the card"
        />
        <BackgroundImageControls
          style={style}
          onChange={onChange}
          visible={style.showBackgroundImage}
          idPrefix="service-benefits"
        />
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Overlay"
          hint="Color wash over the photo"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Overlay color"
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

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(SERVICE_BENEFITS_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_SERVICE_BENEFITS_STYLE}
      />
    </div>
  );
}

export default function ServiceBenefitsListPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <ServiceBenefitsListContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <ServiceBenefitsListStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
