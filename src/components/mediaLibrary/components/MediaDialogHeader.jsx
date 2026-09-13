"use client";

import { XIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";

export default function MediaDialogHeader({ title = "Insert Media", onClose }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-200 bg-white px-5 py-4">
      <h2
        id="media-library-title"
        className={`${typography.itemTitle} font-semibold text-main`}
      >
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close media dialog"
        className="cursor-pointer rounded-sm p-1.5 text-500 transition-colors hover:bg-100 hover:text-main"
      >
        <XIcon size={20} weight="bold" aria-hidden />
      </button>
    </header>
  );
}
