import { typography } from "@/styles/typography";
import { inspectorControlClass } from "../constants";

export default function InspectorSelect({ id, label, value, options, onChange }) {
  return (
    <label className="flex flex-col gap-1" htmlFor={id}>
      <span className={`${typography.caption} text-700`}>{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inspectorControlClass} cursor-pointer`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
