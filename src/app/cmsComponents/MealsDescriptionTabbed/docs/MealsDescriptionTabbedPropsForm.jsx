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
import MealsDescriptionTabbedContentForm from "./MealsDescriptionTabbedContentForm";
import {
  CARD_RADIUS_OPTIONS,
  DEFAULT_MEALS_TABBED_STYLE,
  MEALS_TABBED_STYLE_RESET_KEYS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function MealsDescriptionTabbedStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_MEALS_TABBED_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(MEALS_TABBED_STYLE_RESET_KEYS.layout)}
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
          checked={style.showTabs}
          onChange={() => toggle("showTabs")}
          label="Tabs"
          hint="Show breakfast / lunch tabs"
        />
        {style.showTabs ? (
          <>
            <InspectorColor
              label="Active color"
              value={style.tabActive}
              onChange={(value) => update("tabActive", value)}
            />
            <InspectorColor
              label="Idle text"
              value={style.tabIdle}
              onChange={(value) => update("tabIdle", value)}
            />
            <InspectorColor
              label="Track color"
              value={style.tabBorder}
              onChange={(value) => update("tabBorder", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showImage}
          onChange={() => toggle("showImage")}
          label="Image"
          hint="Photo beside the meal list"
        />
        {style.showImage ? (
          <InspectorChoose
            label="Corners"
            name="imageRadius"
            value={style.imageRadius}
            options={CARD_RADIUS_OPTIONS}
            onChange={(value) => update("imageRadius", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showNotes}
          onChange={() => toggle("showNotes")}
          label="Notes"
          hint="Show the notes under the list"
        />
        {style.showNotes ? (
          <InspectorColor
            label="Notes color"
            value={style.notesColor}
            onChange={(value) => update("notesColor", value)}
          />
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
        title="Accordion"
        onReset={() => reset(MEALS_TABBED_STYLE_RESET_KEYS.accordion)}
      >
        <InspectorSwitch
          checked={style.showItemTitle}
          onChange={() => toggle("showItemTitle")}
          label="Item title"
          hint="Meal item names"
        />
        {style.showItemTitle ? (
          <>
            <InspectorColor
              label="Item title"
              value={style.itemTitleColor}
              onChange={(value) => update("itemTitleColor", value)}
            />
            <InspectorColor
              label="Grouped item title"
              value={style.groupItemTitleColor}
              onChange={(value) => update("groupItemTitleColor", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showItemDescription}
          onChange={() => toggle("showItemDescription")}
          label="Item copy"
          hint="Meal item descriptions"
        />
        {style.showItemDescription ? (
          <InspectorColor
            label="Item copy"
            value={style.itemBodyColor}
            onChange={(value) => update("itemBodyColor", value)}
          />
        ) : null}
        <InspectorChoose
          label="Corners"
          name="accordionRadius"
          value={style.accordionRadius}
          options={CARD_RADIUS_OPTIONS}
          onChange={(value) => update("accordionRadius", value)}
        />
        <InspectorColor
          label="Header background"
          value={style.headerBg}
          onChange={(value) => update("headerBg", value)}
        />
        <InspectorColor
          label="Header text"
          value={style.headerText}
          onChange={(value) => update("headerText", value)}
        />
        <InspectorColor
          label="Body background"
          value={style.bodyBg}
          onChange={(value) => update("bodyBg", value)}
        />
        <InspectorColor
          label="Group title"
          value={style.groupTitleColor}
          onChange={(value) => update("groupTitleColor", value)}
        />
        <InspectorColor
          label="Row background"
          value={style.itemBg}
          onChange={(value) => update("itemBg", value)}
        />
        <InspectorColor
          label="Stripe color"
          value={style.stripeColor}
          onChange={(value) => update("stripeColor", value)}
        />
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(MEALS_TABBED_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_MEALS_TABBED_STYLE}
      />
    </div>
  );
}

export default function MealsDescriptionTabbedPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <MealsDescriptionTabbedContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <MealsDescriptionTabbedStyleForm
          style={style}
          onChange={onStyleChange}
        />
      }
    />
  );
}
