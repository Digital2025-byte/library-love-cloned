import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSwitch,
} from "@/components/inspector";
import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  LINK_UNDERLINE_OPTIONS,
} from "./core/style";

/**
 * Style-tab controls for backlink appearance.
 */
export default function BacklinksStyleSection({
  style,
  onChange,
  onReset,
  defaults = DEFAULT_BACKLINK_STYLE,
}) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset =
    onReset ||
    (() => {
      const next = { ...style };
      for (const key of BACKLINK_STYLE_RESET_KEYS) {
        next[key] = defaults[key];
      }
      onChange(next);
    });

  return (
    <InspectorSection title="Backlinks" onReset={reset}>
      <InspectorSwitch
        checked={style.showLinks}
        onChange={() => toggle("showLinks")}
        label="Backlinks"
        hint="Turn chosen words into links"
      />
      {style.showLinks ? (
        <>
          <InspectorColor
            label="Color"
            value={style.linkColor}
            onChange={(value) => update("linkColor", value)}
          />
          <InspectorColor
            label="Hover color"
            value={style.linkHoverColor}
            onChange={(value) => update("linkHoverColor", value)}
          />
          <InspectorFontWeight
            id="linkColor-weight"
            label="Weight"
            value={style.linkFontWeight}
            onChange={(value) => update("linkFontWeight", value)}
          />
          <InspectorChoose
            label="Underline"
            name="linkUnderline"
            value={style.linkUnderline}
            options={LINK_UNDERLINE_OPTIONS}
            onChange={(value) => update("linkUnderline", value)}
          />
          <InspectorSwitch
            checked={style.linkItalic}
            onChange={() => toggle("linkItalic")}
            label="Italic"
            hint="Italic linked words"
          />
        </>
      ) : null}
    </InspectorSection>
  );
}
