import InspectorSelect from "../InspectorSelect";
import {
  FONT_WEIGHT_OPTIONS,
  resolveFontWeight,
} from "@/styles/fontWeight";

/**
 * Dropdown for a single text role's font-weight.
 * Place next to the matching InspectorColor control.
 */
export default function InspectorFontWeight({
  id,
  label = "Weight",
  value,
  onChange,
  fallback = "medium",
}) {
  return (
    <InspectorSelect
      id={id}
      label={label}
      value={resolveFontWeight(value, fallback)}
      options={FONT_WEIGHT_OPTIONS}
      onChange={onChange}
    />
  );
}
