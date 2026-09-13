import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import FaqExplorerContentForm from "./FaqExplorerContentForm";
import {
  DEFAULT_FAQ_EXPLORER_STYLE,
  FAQ_EXPLORER_STYLE_RESET_KEYS,
  ITEM_RADIUS_OPTIONS,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from "../utils/style";

function FaqExplorerStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_FAQ_EXPLORER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(FAQ_EXPLORER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showTitle}
          onChange={() => toggle("showTitle")}
          label="Title"
        />
        {style.showTitle ? (
          <>
            <InspectorColor
              label="Title color"
              value={style.titleColor}
              onChange={(value) => update("titleColor", value)}
            />
            <InspectorFontWeight
              id="faqExplorer-title-weight"
              label="Title weight"
              value={style.titleFontWeight}
              onChange={(value) => update("titleFontWeight", value)}
            />
            <InspectorChoose
              label="Alignment"
              name="titleAlign"
              value={style.titleAlign}
              options={TITLE_ALIGN_OPTIONS}
              onChange={(value) => update("titleAlign", value)}
            />
          </>
        ) : null}
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Section background"
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
        <InspectorColor
          label="Active tab color"
          value={style.activeTabColor}
          onChange={(value) => update("activeTabColor", value)}
        />
        <InspectorColor
          label="Inactive tab color"
          value={style.inactiveTabColor}
          onChange={(value) => update("inactiveTabColor", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Questions"
        onReset={() => reset(FAQ_EXPLORER_STYLE_RESET_KEYS.items)}
      >
        <InspectorSwitch
          checked={style.showItemBg}
          onChange={() => toggle("showItemBg")}
          label="Card fill"
        />
        {style.showItemBg ? (
          <InspectorColor
            label="Card background"
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
        <InspectorColor
          label="Question color"
          value={style.questionColor}
          onChange={(value) => update("questionColor", value)}
        />
        <InspectorFontWeight
          id="faqExplorer-question-weight"
          label="Question weight"
          value={style.questionFontWeight}
          onChange={(value) => update("questionFontWeight", value)}
        />
        <InspectorColor
          label="Answer color"
          value={style.answerColor}
          onChange={(value) => update("answerColor", value)}
        />
        <InspectorColor
          label="Icon color"
          value={style.iconColor}
          onChange={(value) => update("iconColor", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Browse button"
        onReset={() => reset(FAQ_EXPLORER_STYLE_RESET_KEYS.browse)}
      >
        <InspectorSwitch
          checked={style.showBrowse}
          onChange={() => toggle("showBrowse")}
          label="Browse button"
        />
        {style.showBrowse ? (
          <>
            <InspectorColor
              label="Background"
              value={style.browseBg}
              onChange={(value) => update("browseBg", value)}
            />
            <InspectorColor
              label="Text"
              value={style.browseText}
              onChange={(value) => update("browseText", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function FaqExplorerPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <FaqExplorerContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<FaqExplorerStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
