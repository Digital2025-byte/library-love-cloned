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
import TitleWithListContentForm from "./TitleWithListContentForm";
import {
  DEFAULT_TITLE_WITH_LIST_STYLE,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  TITLE_WITH_LIST_STYLE_RESET_KEYS,
} from "../utils/style";

function TitleWithListStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_TITLE_WITH_LIST_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(TITLE_WITH_LIST_STYLE_RESET_KEYS.layout)}
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
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
          hint="Info icon beside the title"
        />
        {style.showIcon ? (
          <InspectorColor
            label="Icon color"
            value={style.iconColor}
            onChange={(value) => update("iconColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showDescription}
          onChange={() => toggle("showDescription")}
          label="Description"
          hint="Show the list under the title"
        />
        {style.showDescription ? (
          <InspectorColor
            label="List color"
            value={style.descriptionColor}
            onChange={(value) => update("descriptionColor", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showBullets}
          onChange={() => toggle("showBullets")}
          label="Bullets"
          hint="Dots beside each item"
        />
        {style.showBullets ? (
          <InspectorColor
            label="Bullet color"
            value={style.bulletColor}
            onChange={(value) => update("bulletColor", value)}
          />
        ) : null}
        {style.showTitle || style.showDescription ? (
          <InspectorChoose
            label="Alignment"
            name="titleAlign"
            value={style.titleAlign}
            options={TITLE_ALIGN_OPTIONS}
            onChange={(value) => update("titleAlign", value)}
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

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(TITLE_WITH_LIST_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_TITLE_WITH_LIST_STYLE}
      />
    </div>
  );
}

export default function TitleWithListPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <TitleWithListContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={
        <TitleWithListStyleForm style={style} onChange={onStyleChange} />
      }
    />
  );
}
