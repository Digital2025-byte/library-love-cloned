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
import CarouselImageText6ContentForm from "./CarouselImageText6ContentForm";
import {
  CAROUSEL_IMAGE_TEXT_STYLE_RESET_KEYS,
  DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE,
  OPEN_ON_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function CarouselImageText6StyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(CAROUSEL_IMAGE_TEXT_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Section heading above the carousel"
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
      </InspectorSection>

      <InspectorSection
        title="Items"
        onReset={() => reset(CAROUSEL_IMAGE_TEXT_STYLE_RESET_KEYS.cards)}
      >
        <InspectorSwitch
          checked={style.showItemTitle}
          onChange={() => toggle("showItemTitle")}
          label="Names"
          hint="Title on each value card"
        />
        {style.showItemTitle ? (
          <InspectorColor
            label="Title color"
            value={style.itemTitleColor}
            onChange={(value) => update("itemTitleColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showItemDescription}
          onChange={() => toggle("showItemDescription")}
          label="Description"
          hint="Body text on each value card"
        />
        {style.showItemDescription ? (
          <InspectorColor
            label="Body color"
            value={style.itemBodyColor}
            onChange={(value) => update("itemBodyColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.grayscaleInactive}
          onChange={() => toggle("grayscaleInactive")}
          label="Grayscale"
          hint="Fade inactive desktop panels to gray"
        />
        <InspectorChoose
          label="Open"
          name="openOn"
          value={style.openOn}
          options={OPEN_ON_OPTIONS}
          onChange={(value) => update("openOn", value)}
        />
        <InspectorSwitch
          checked={style.showCardBg}
          onChange={() => toggle("showCardBg")}
          label="Card background"
          hint="Fill behind mobile slide cards"
        />
        {style.showCardBg ? (
          <InspectorColor
            label="Card background"
            value={style.cardBg}
            onChange={(value) => update("cardBg", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showOverlay}
          onChange={() => toggle("showOverlay")}
          label="Overlay"
          hint="Tint over inactive panels and image placeholders"
        />
        {style.showOverlay ? (
          <InspectorColor
            label="Overlay"
            value={style.overlayColor}
            onChange={(value) => update("overlayColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showPanelBg}
          onChange={() => toggle("showPanelBg")}
          label="Frosted panel"
          hint="Background on the desktop description panel"
        />
        {style.showPanelBg ? (
          <InspectorColor
            label="Frosted panel"
            value={style.panelColor}
            onChange={(value) => update("panelColor", value)}
          />
        ) : null}
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(CAROUSEL_IMAGE_TEXT_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE}
      />
    </div>
  );
}

export default function CarouselImageText6PropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <CarouselImageText6ContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <CarouselImageText6StyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
