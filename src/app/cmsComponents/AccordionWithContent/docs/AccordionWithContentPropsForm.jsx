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
import AccordionWithContentContentForm from "./AccordionWithContentContentForm";
import {
  ACCORDION_STYLE_RESET_KEYS,
  BUTTON_POSITION_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  BUTTON_WIDTH_OPTIONS,
  DEFAULT_ACCORDION_STYLE,
  ITEM_LOOK_OPTIONS,
  ITEM_RADIUS_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function AccordionWithContentStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_ACCORDION_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(ACCORDION_STYLE_RESET_KEYS.layout)}
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
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="Button"
          hint="Show the CTA under the items"
        />
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
        onReset={() => reset(ACCORDION_STYLE_RESET_KEYS.items)}
      >
        <InspectorChoose
          label="Look"
          name="itemLook"
          value={style.itemLook}
          options={ITEM_LOOK_OPTIONS}
          onChange={(value) => update("itemLook", value)}
        />
        {style.itemLook === "filled" ? (
          <>
            <InspectorSwitch
              checked={style.showItemBg}
              onChange={() => toggle("showItemBg")}
              label="Background"
              hint="Fill color on each accordion item"
            />
            {style.showItemBg ? (
              <InspectorColor
                label="Background"
                value={style.itemBg}
                onChange={(value) => update("itemBg", value)}
              />
            ) : null}
          </>
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

      {style.showButton ? (
        <InspectorSection
          title="Button"
          onReset={() => reset(ACCORDION_STYLE_RESET_KEYS.button)}
        >
          <InspectorChoose
            label="Alignment"
            name="buttonPosition"
            value={style.buttonPosition}
            options={BUTTON_POSITION_OPTIONS}
            onChange={(value) => update("buttonPosition", value)}
          />
          <InspectorChoose
            label="Look"
            name="buttonVariant"
            value={style.buttonVariant}
            options={BUTTON_VARIANT_OPTIONS}
            onChange={(value) => update("buttonVariant", value)}
          />
          <InspectorChoose
            label="Width"
            name="buttonWidth"
            value={style.buttonWidth}
            options={BUTTON_WIDTH_OPTIONS}
            onChange={(value) => update("buttonWidth", value)}
          />
        </InspectorSection>
      ) : null}

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(ACCORDION_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_ACCORDION_STYLE}
      />
    </div>
  );
}

export default function AccordionWithContentPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <AccordionWithContentContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <AccordionWithContentStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
