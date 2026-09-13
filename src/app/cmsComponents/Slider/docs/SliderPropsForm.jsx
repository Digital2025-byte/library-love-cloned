import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSelect,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksStyleSection } from "@/app/cmsComponents/shared/backlinks";
import SliderContentForm from "./SliderContentForm";
import {
  AUTOPLAY_SPEED_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  DEFAULT_SLIDER_STYLE,
  EASING_OPTIONS,
  EFFECT_OPTIONS,
  OPACITY_OPTIONS,
  OVERLAY_DIRECTION_OPTIONS,
  OVERLAY_TO_OPTIONS,
  SLIDER_STYLE_RESET_KEYS,
  TITLE_ALIGN_OPTIONS,
  TOUCH_OPTIONS,
  TRANSITION_SPEED_OPTIONS,
} from "../utils/style";

function SliderStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_SLIDER_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(SLIDER_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSwitch
          checked={style.showSlideText}
          onChange={() => toggle("showSlideText")}
          label="Text"
          hint="Title, subtitle, and description on slides"
        />
        <InspectorSwitch
          checked={style.showButton}
          onChange={() => toggle("showButton")}
          label="Button"
          hint="CTA button on slides"
        />
        <InspectorSwitch
          checked={style.showArrows}
          onChange={() => toggle("showArrows")}
          label="Arrows"
          hint="Previous / next arrow controls"
        />
        <InspectorSwitch
          checked={style.showProgress}
          onChange={() => toggle("showProgress")}
          label="Progress"
          hint="Pause control and progress dots"
        />
      </InspectorSection>

      <InspectorSection
        title="Theme"
        onReset={() => reset(SLIDER_STYLE_RESET_KEYS.theme)}
      >
        <InspectorColor
          label="Controls"
          value={style.theme}
          onChange={(value) => update("theme", value)}
        />
      </InspectorSection>

      {style.showSlideText ? (
        <InspectorSection
          title="Text"
          onReset={() => reset(SLIDER_STYLE_RESET_KEYS.text)}
        >
          <InspectorSwitch
            checked={style.showTitleText}
            onChange={() => toggle("showTitleText")}
            label="Title"
            hint="Main heading on each slide"
          />
          {style.showTitleText ? (
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
            checked={style.showSubtitleText}
            onChange={() => toggle("showSubtitleText")}
            label="Subtitle"
            hint="Small text above the title"
          />
          {style.showSubtitleText ? (
            <>
            <InspectorColor
              label="Subtitle color"
              value={style.subtitleColor}
              onChange={(value) => update("subtitleColor", value)}
            />
          <InspectorFontWeight
            id="subtitleColor-weight"
            label="Subtitle weight"
            value={style.subtitleFontWeight}
            onChange={(value) => update("subtitleFontWeight", value)}
          />
          </>
          ) : null}
          <InspectorSwitch
            checked={style.showDescriptionText}
            onChange={() => toggle("showDescriptionText")}
            label="Description"
            hint="Body text under the title"
          />
          {style.showDescriptionText ? (
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
          <InspectorChoose
            label="Alignment"
            name="titleAlign"
            value={style.titleAlign}
            options={TITLE_ALIGN_OPTIONS}
            onChange={(value) => update("titleAlign", value)}
          />
        </InspectorSection>
      ) : null}

      {style.showButton ? (
        <InspectorSection
          title="Button"
          onReset={() => reset(SLIDER_STYLE_RESET_KEYS.button)}
        >
          <InspectorChoose
            label="Look"
            name="buttonVariant"
            value={style.buttonVariant}
            options={BUTTON_VARIANT_OPTIONS}
            onChange={(value) => update("buttonVariant", value)}
          />
        </InspectorSection>
      ) : null}

      <InspectorSection
        title="Overlay"
        onReset={() => reset(SLIDER_STYLE_RESET_KEYS.overlay)}
      >
        <InspectorSwitch
          checked={style.overlayEnabled}
          onChange={() => toggle("overlayEnabled")}
          label="Overlay"
          hint="Gradient over the slide image"
        />
        {style.overlayEnabled ? (
          <>
            <InspectorColor
              label="Color"
              value={style.overlayColor}
              onChange={(value) => update("overlayColor", value)}
            />
            <InspectorChoose
              label="Direction"
              name="overlayDirection"
              value={style.overlayDirection}
              options={OVERLAY_DIRECTION_OPTIONS}
              onChange={(value) => update("overlayDirection", value)}
            />
            <InspectorSelect
              id="overlay-from"
              label="Start opacity"
              value={style.overlayFromOpacity}
              options={OPACITY_OPTIONS}
              onChange={(value) => update("overlayFromOpacity", value)}
            />
            <InspectorSelect
              id="overlay-via"
              label="Mid opacity"
              value={style.overlayViaOpacity}
              options={OPACITY_OPTIONS}
              onChange={(value) => update("overlayViaOpacity", value)}
            />
            <InspectorChoose
              label="End color"
              name="overlayTo"
              value={style.overlayTo}
              options={OVERLAY_TO_OPTIONS}
              onChange={(value) => update("overlayTo", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Slider"
        onReset={() => reset(SLIDER_STYLE_RESET_KEYS.slider)}
      >
        <InspectorChoose
          label="Effect"
          name="sliderEffect"
          value={style.fade ? "fade" : "slide"}
          options={EFFECT_OPTIONS}
          onChange={(value) => update("fade", value === "fade")}
        />
        <InspectorSwitch
          checked={style.infinite}
          onChange={() => toggle("infinite")}
          label="Loop"
          hint="Loop back to the first slide"
        />
        <InspectorSwitch
          checked={style.autoplay}
          onChange={() => toggle("autoplay")}
          label="Autoplay"
          hint="Advance slides automatically"
        />
        {style.autoplay ? (
          <InspectorSelect
            id="autoplay-speed"
            label="Autoplay speed"
            value={style.autoplaySpeed}
            options={AUTOPLAY_SPEED_OPTIONS}
            onChange={(value) => update("autoplaySpeed", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.pauseOnHover}
          onChange={() => toggle("pauseOnHover")}
          label="Pause on hover"
          hint="Pause autoplay when the pointer is over the slider"
        />
        <InspectorSwitch
          checked={style.pauseOnFocus}
          onChange={() => toggle("pauseOnFocus")}
          label="Pause on focus"
          hint="Pause autoplay when a control is focused"
        />
        <InspectorSelect
          id="transition-speed"
          label="Transition speed"
          value={style.speed}
          options={TRANSITION_SPEED_OPTIONS}
          onChange={(value) => update("speed", value)}
        />
        <InspectorSelect
          id="easing"
          label="Easing"
          value={style.cssEase}
          options={EASING_OPTIONS}
          onChange={(value) => update("cssEase", value)}
        />
        <InspectorSwitch
          checked={style.waitForAnimate}
          onChange={() => toggle("waitForAnimate")}
          label="Wait for animation"
          hint="Block the next move until the current one finishes"
        />
        <InspectorSwitch
          checked={style.swipe}
          onChange={() => toggle("swipe")}
          label="Swipe"
          hint="Allow touch swipe"
        />
        <InspectorSwitch
          checked={style.draggable}
          onChange={() => toggle("draggable")}
          label="Drag"
          hint="Allow mouse drag"
        />
        {style.swipe || style.draggable ? (
          <InspectorChoose
            label="Touch"
            name="touchThreshold"
            value={style.touchThreshold}
            options={TOUCH_OPTIONS}
            onChange={(value) => update("touchThreshold", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.adaptiveHeight}
          onChange={() => toggle("adaptiveHeight")}
          label="Adaptive height"
          hint="Resize the track to each slide"
        />
      </InspectorSection>

      <BacklinksStyleSection
        style={style}
        onChange={onChange}
        onReset={() => reset(SLIDER_STYLE_RESET_KEYS.links)}
        defaults={DEFAULT_SLIDER_STYLE}
      />
    </div>
  );
}

export default function SliderPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <SliderContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<SliderStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
