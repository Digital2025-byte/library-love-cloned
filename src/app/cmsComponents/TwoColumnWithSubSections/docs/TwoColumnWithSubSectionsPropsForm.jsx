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
import TwoColumnWithSubSectionsContentForm from "./TwoColumnWithSubSectionsContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  TWO_COLUMN_SUB_SECTIONS_STYLE_RESET_KEYS,
} from "../utils/style";

function TwoColumnWithSubSectionsStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(
      applyInspectorReset(style, DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE, keys)
    );

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(TWO_COLUMN_SUB_SECTIONS_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
          hint="Show the heading"
        />
        {style.showTitle ? (
          <>
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
          checked={style.showSectionLabel}
          onChange={() => toggle("showSectionLabel")}
          label="Label"
          hint="Small label above the title"
        />
        {style.showSectionLabel ? (
          <>
          <InspectorColor
            label="Label color"
            value={style.labelColor}
            onChange={(value) => update("labelColor", value)}
          />
          <InspectorFontWeight
            id="labelColor-weight"
            label="Label weight"
            value={style.labelFontWeight}
            onChange={(value) => update("labelFontWeight", value)}
          />
        </>
        ) : null}
        {style.showTitle || style.showDescription || style.showSectionLabel ? (
          <InspectorChoose
            label="Alignment"
            name="titleAlign"
            value={style.titleAlign}
            options={TITLE_ALIGN_OPTIONS}
            onChange={(value) => update("titleAlign", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showSubSections}
          onChange={() => toggle("showSubSections")}
          label="Subsections"
          hint="The two text columns"
        />
        <InspectorSwitch
          checked={style.showCta}
          onChange={() => toggle("showCta")}
          label="Button"
          hint="Show the CTA"
        />
        {style.showCta ? (
          <>
            <InspectorColor
              label="Button background"
              value={style.buttonBg}
              onChange={(value) => update("buttonBg", value)}
            />
            <InspectorColor
              label="Button text"
              value={style.buttonText}
              onChange={(value) => update("buttonText", value)}
            />
          <InspectorFontWeight
            id="buttonText-weight"
            label="Button text weight"
            value={style.buttonTextFontWeight}
            onChange={(value) => update("buttonTextFontWeight", value)}
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

      {style.showSubSections ? (
        <InspectorSection
          title="Subsections"
          onReset={() => reset(TWO_COLUMN_SUB_SECTIONS_STYLE_RESET_KEYS.items)}
        >
          <InspectorColor
            label="Item title"
            value={style.itemTitleColor}
            onChange={(value) => update("itemTitleColor", value)}
          />
          <InspectorColor
            label="Item text"
            value={style.itemBodyColor}
            onChange={(value) => update("itemBodyColor", value)}
          />
          <InspectorColor
            label="Divider"
            value={style.dividerColor}
            onChange={(value) => update("dividerColor", value)}
          />
        </InspectorSection>
      ) : null}

      <InspectorSection
        title="Images"
        onReset={() => reset(TWO_COLUMN_SUB_SECTIONS_STYLE_RESET_KEYS.images)}
      >
        <InspectorSwitch
          checked={style.showImages}
          onChange={() => toggle("showImages")}
          label="Photos"
          hint="Main and overlay images"
        />
        <InspectorChoose
          label="Corners"
          name="imageRadius"
          value={style.imageRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("imageRadius", value)}
        />
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(TWO_COLUMN_SUB_SECTIONS_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE}
      />
    </div>
  );
}

export default function TwoColumnWithSubSectionsPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <TwoColumnWithSubSectionsContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <TwoColumnWithSubSectionsStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
