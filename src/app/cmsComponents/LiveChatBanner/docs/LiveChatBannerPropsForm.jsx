import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import LiveChatBannerContentForm from "./LiveChatBannerContentForm";
import {
  DEFAULT_LIVE_CHAT_BANNER_STYLE,
  LIVE_CHAT_BANNER_STYLE_RESET_KEYS,
  OPACITY_OPTIONS,
  PANEL_RADIUS_OPTIONS,
  SPACING_OPTIONS,
} from "../utils/style";

function LiveChatBannerStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_LIVE_CHAT_BANNER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Panel"
        onReset={() => reset(LIVE_CHAT_BANNER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorColor
          label="Panel background"
          value={style.panelBg}
          onChange={(value) => update("panelBg", value)}
        />
        <InspectorChoose
          label="Fill strength"
          name="panelBgOpacity"
          value={style.panelBgOpacity}
          options={OPACITY_OPTIONS}
          onChange={(value) => update("panelBgOpacity", value)}
        />
        <InspectorChoose
          label="Padding"
          name="panelPadding"
          value={style.panelPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("panelPadding", value)}
        />
        <InspectorChoose
          label="Corners"
          name="panelRadius"
          value={style.panelRadius}
          options={PANEL_RADIUS_OPTIONS}
          onChange={(value) => update("panelRadius", value)}
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Section background"
          hint="Fill color behind the panel"
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
        title="Content"
        onReset={() => reset(LIVE_CHAT_BANNER_STYLE_RESET_KEYS.content)}
      >
        <InspectorSwitch
          checked={style.showIcon}
          onChange={() => toggle("showIcon")}
          label="Icon"
          hint="Chat icon on the left"
        />
        {style.showIcon ? (
          <InspectorColor
            label="Icon color"
            value={style.iconColor}
            onChange={(value) => update("iconColor", value)}
          />
        ) : null}
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
              id="liveChat-title-weight"
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
              id="liveChat-description-weight"
              label="Description weight"
              value={style.descriptionFontWeight}
              onChange={(value) => update("descriptionFontWeight", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Button"
        onReset={() => reset(LIVE_CHAT_BANNER_STYLE_RESET_KEYS.button)}
      >
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="Button"
          hint="Show the call-to-action button"
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
            <InspectorFontWeight
              id="liveChat-button-weight"
              label="Text weight"
              value={style.buttonFontWeight}
              onChange={(value) => update("buttonFontWeight", value)}
            />
          </>
        ) : null}
      </InspectorSection>
    </div>
  );
}

export default function LiveChatBannerPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <LiveChatBannerContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<LiveChatBannerStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
