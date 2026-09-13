import { typography } from "@/styles/typography";
import { inspectorControlClass } from "../constants";

export default function InspectorField({
  id,
  label,
  value,
  onChange,
  multiline = false,
}) {
  return (
    <label className="flex flex-col gap-1" htmlFor={id}>
      <span className={`${typography.caption} text-700`}>{label}</span>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inspectorControlClass} cursor-text resize-y`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inspectorControlClass} cursor-text`}
        />
      )}
    </label>
  );
}
