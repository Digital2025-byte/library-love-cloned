import { typography } from "@/styles/typography";
import { CircleNotchIcon } from "@phosphor-icons/react";

export default function InspectorSubmitButton({
  onClick,
  children = "Submit",
  type = "button",
  loading = false,
  disabled = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${typography.button} inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-main bg-main px-4 py-2.5 font-medium text-50 transition-opacity hover:bg-main-light disabled:cursor-wait disabled:opacity-60`}
    >
      {loading ? (
        <CircleNotchIcon size={18} weight="bold" className="animate-spin" aria-hidden />
      ) : null}
      {loading ? "Saving…" : children}
    </button>
  );
}
