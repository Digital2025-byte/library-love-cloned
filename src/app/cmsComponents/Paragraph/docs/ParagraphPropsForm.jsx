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
import { MediaField } from "@/components/mediaLibrary";
import ParagraphContentForm from "./ParagraphContentForm";
import {
  DEFAULT_PARAGRAPH_STYLE,
  PARAGRAPH_STYLE_RESET_KEYS,
  SECTION_BG_TYPE_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function ParagraphStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_PARAGRAPH_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(PARAGRAPH_STYLE_RESET_KEYS.layout)}
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
          hint="Fill behind the section"
        />
        {style.showSectionBg ? (
          <>
            <InspectorChoose
              label="Background type"
              name="sectionBgType"
              value={style.sectionBgType || "color"}
              options={SECTION_BG_TYPE_OPTIONS}
              onChange={(value) => update("sectionBgType", value)}
            />
            {style.sectionBgType === "image" ? (
              <MediaField
                id="paragraph-section-bg-image"
                label="Background image"
                value={style.sectionBgImage || ""}
                onChange={(value) => update("sectionBgImage", value)}
              />
            ) : (
              <InspectorColor
                label="Background color"
                value={style.sectionBg}
                onChange={(value) => update("sectionBg", value)}
              />
            )}
            <BackgroundImageControls
              style={style}
              onChange={onChange}
              visible={Boolean(
                style.showSectionBg && style.sectionBgType === "image"
              )}
              idPrefix="paragraph"
            />
            <InspectorSwitch
              checked={style.showOverlay}
              onChange={() => toggle("showOverlay")}
              label="Overlay"
              hint="Color wash over the background"
            />
            {style.showOverlay ? (
              <InspectorColor
                label="Overlay color"
                value={style.overlayColor}
                onChange={(value) => update("overlayColor", value)}
              />
            ) : null}
          </>
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
        onReset={() => reset(PARAGRAPH_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_PARAGRAPH_STYLE}
      />
    </div>
  );
}

export default function ParagraphPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <ParagraphContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<ParagraphStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
