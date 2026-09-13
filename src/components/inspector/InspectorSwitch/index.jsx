import { CheckIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";

export default function InspectorSwitch({ checked, onChange, label, hint }) {
  return (
    <label className="group flex cursor-pointer items-start justify-between gap-3">
      <span className="min-w-0">
        <span className={`${typography.caption} block font-medium text-main`}>
          {label}
        </span>
        {hint ? (
          <span className={`${typography.caption} text-500`}>{hint}</span>
        ) : null}
      </span>
      <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className="pointer-events-none flex h-5 w-5 items-center justify-center rounded-sm border border-200 bg-white text-white transition-colors group-hover:border-800 peer-checked:border-main peer-checked:bg-main peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-800/25 peer-focus-visible:ring-offset-1"
        >
          <CheckIcon
            className="h-3 w-3 scale-75 opacity-0 transition-all duration-150"
            weight="bold"
          />
        </span>
      </span>
    </label>
  );
}
