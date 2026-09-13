import { typography } from "@/styles/typography";

export default function InspectorChoose({ label, name, value, options, onChange }) {
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={`${typography.caption} text-700`}>{label}</legend>
      <div className="flex flex-wrap gap-4">
        {items.map((option) => (
          <label
            key={option.value}
            className={`${typography.caption} flex cursor-pointer items-center gap-2 text-foreground`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 shrink-0 cursor-pointer accent-foreground"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
