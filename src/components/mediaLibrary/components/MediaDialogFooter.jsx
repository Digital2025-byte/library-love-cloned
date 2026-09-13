"use client";

import { typography } from "@/styles/typography";

export default function MediaDialogFooter({
  canSelect = false,
  onSelect,
  selectLabel = "Select",
}) {
  return (
    <footer className="flex shrink-0 items-center justify-end border-t border-200 bg-50 px-5 py-3">
      <button
        type="button"
        disabled={!canSelect}
        onClick={onSelect}
        className={`${typography.caption} cursor-pointer rounded-sm bg-primary-1 px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {selectLabel}
      </button>
    </footer>
  );
}
