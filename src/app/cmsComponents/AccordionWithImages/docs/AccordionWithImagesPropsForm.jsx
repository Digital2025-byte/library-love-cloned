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
import AccordionWithImagesContentForm from "./AccordionWithImagesContentForm";
import {
  ACCORDION_IMAGES_STYLE_RESET_KEYS,
  DEFAULT_ACCORDION_IMAGES_STYLE,
  IMAGE_POSITION_OPTIONS,
  ITEM_LOOK_OPTIONS,
  ITEM_RADIUS_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function AccordionWithImagesStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_ACCORDION_IMAGES_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(ACCORDION_IMAGES_STYLE_RESET_KEYS.layout)}
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
            <InspectorSwitch
              checked={style.showTitleBorder}
              onChange={() => toggle("showTitleBorder")}
              label="Underline"
              hint="Show a line under the title"
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
          checked={style.showImagePanel}
          onChange={() => toggle("showImagePanel")}
          label="Image panel"
          hint="Side image that follows the open item"
        />
        <InspectorColor
          label="Section background"
          value={style.sectionBg}
          onChange={(value) => update("sectionBg", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Items"
        onReset={() => reset(ACCORDION_IMAGES_STYLE_RESET_KEYS.items)}
      >
        <InspectorChoose
          label="Look"
          name="itemLook"
          value={style.itemLook}
          options={ITEM_LOOK_OPTIONS}
          onChange={(value) => update("itemLook", value)}
        />
        {style.itemLook === "filled" ? (
          <InspectorColor
            label="Background"
            value={style.itemBg}
            onChange={(value) => update("itemBg", value)}
          />
        ) : null}
        <InspectorChoose
          label="Corners"
          name="itemRadius"
          value={style.itemRadius}
          options={ITEM_RADIUS_OPTIONS}
          onChange={(value) => update("itemRadius", value)}
        />
        <InspectorChoose
          label="Gap"
          name="itemGap"
          value={style.itemGap}
          options={SPACING_OPTIONS}
          onChange={(value) => update("itemGap", value)}
        />
        <InspectorChoose
          label="Padding"
          name="itemPadding"
          value={style.itemPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("itemPadding", value)}
        />
        {style.itemLook === "filled" ? (
          <InspectorSwitch
            checked={style.showItemDivider}
            onChange={() => toggle("showItemDivider")}
            label="Divider"
            hint="Line between items"
          />
        ) : null}
        <InspectorColor
          label="Title color"
          value={style.itemTitleColor}
          onChange={(value) => update("itemTitleColor", value)}
        />
        <InspectorFontWeight
          id="itemTitleColor-weight"
          label="Title weight"
          value={style.itemTitleFontWeight}
          onChange={(value) => update("itemTitleFontWeight", value)}
        />
        <InspectorColor
          label="Open title color"
          value={style.itemOpenColor}
          onChange={(value) => update("itemOpenColor", value)}
        />
        <InspectorColor
          label="Body color"
          value={style.itemBodyColor}
          onChange={(value) => update("itemBodyColor", value)}
        />
        <InspectorFontWeight
          id="itemBodyColor-weight"
          label="Body weight"
          value={style.itemBodyFontWeight}
          onChange={(value) => update("itemBodyFontWeight", value)}
        />
      </InspectorSection>

      {style.showImagePanel ? (
        <InspectorSection
          title="Image"
          onReset={() => reset(ACCORDION_IMAGES_STYLE_RESET_KEYS.image)}
        >
          <InspectorChoose
            label="Position"
            name="imagePosition"
            value={style.imagePosition}
            options={IMAGE_POSITION_OPTIONS}
            onChange={(value) => update("imagePosition", value)}
          />
          <InspectorChoose
            label="Corners"
            name="imageRadius"
            value={style.imageRadius}
            options={ITEM_RADIUS_OPTIONS}
            onChange={(value) => update("imageRadius", value)}
          />
          <InspectorColor
            label="Background"
            value={style.imageBg}
            onChange={(value) => update("imageBg", value)}
          />
        </InspectorSection>
      ) : null}

      <InspectorSection
        title="Toggle"
        onReset={() => reset(ACCORDION_IMAGES_STYLE_RESET_KEYS.toggle)}
      >
        <InspectorColor
          label="Background"
          value={style.toggleBg}
          onChange={(value) => update("toggleBg", value)}
        />
        <InspectorColor
          label="Border"
          value={style.toggleBorder}
          onChange={(value) => update("toggleBorder", value)}
        />
        <InspectorColor
          label="Icon"
          value={style.toggleIcon}
          onChange={(value) => update("toggleIcon", value)}
        />
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(ACCORDION_IMAGES_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_ACCORDION_IMAGES_STYLE}
      />
    </div>
  );
}

export default function AccordionWithImagesPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <AccordionWithImagesContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <AccordionWithImagesStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
