import { typography } from "@/styles/typography";

function Checkbox({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-200 bg-white px-3 py-2.5 hover:border-primary-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 accent-primary-1"
      />
      <span>
        <span className={`${typography.body} block font-medium text-main`}>
          {label}
        </span>
        {hint ? (
          <span className={`${typography.caption} text-500`}>{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

export default function LayoutPropsForm({ legend, controls = [], flags, toggle }) {
  return (
    <fieldset className="p-4">
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-2">
        {controls.map(({ key, label, hint }) => (
          <Checkbox
            key={key}
            checked={Boolean(flags[key])}
            onChange={() => toggle(key)}
            label={label}
            hint={hint}
          />
        ))}
      </div>
    </fieldset>
  );
}
