import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";

export default function InspectorReset({
  onClick,
  children = "Reset",
  iconOnly = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={iconOnly ? String(children) : undefined}
      aria-label={iconOnly ? String(children) : undefined}
      className={
        iconOnly
          ? `inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-700 hover:bg-200 hover:text-main ${className}`
          : `${typography.caption} inline-flex cursor-pointer items-center gap-1 font-medium text-700 hover:text-main ${className}`
      }
    >
      <ArrowCounterClockwiseIcon
        size={iconOnly ? 11 : 14}
        className={iconOnly ? "h-3 w-3" : undefined}
        weight="bold"
        aria-hidden
      />
      {iconOnly ? null : children}
    </button>
  );
}
