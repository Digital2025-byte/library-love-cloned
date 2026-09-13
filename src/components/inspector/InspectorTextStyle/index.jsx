import InspectorColor from "../InspectorColor";
import InspectorFontWeight from "../InspectorFontWeight";
import { defaultWeightForKey, weightKeyForColorKey } from "@/styles/fontWeight";

/**
 * Color + weight controls for one text role.
 * Example: colorKey="titleColor" → also drives titleFontWeight.
 */
export default function InspectorTextStyle({
  label,
  colorKey,
  style,
  onUpdate,
  colorId,
  weightId,
}) {
  const weightKey = weightKeyForColorKey(colorKey);
  if (!weightKey) {
    return (
      <InspectorColor
        label={`${label} color`}
        value={style[colorKey]}
        onChange={(value) => onUpdate(colorKey, value)}
      />
    );
  }

  return (
    <>
      <InspectorColor
        id={colorId}
        label={`${label} color`}
        value={style[colorKey]}
        onChange={(value) => onUpdate(colorKey, value)}
      />
      <InspectorFontWeight
        id={weightId || `${colorKey}-weight`}
        label={`${label} weight`}
        value={style[weightKey]}
        fallback={defaultWeightForKey(weightKey)}
        onChange={(value) => onUpdate(weightKey, value)}
      />
    </>
  );
}
