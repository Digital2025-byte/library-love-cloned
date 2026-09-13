"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { XIcon, PlusIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { BLOCK_LIBRARY } from "../registry/blockRegistry";

/**
 * Modal component picker. Lists every block type the builder knows about;
 * choosing one appends it to the page.
 */
export default function AddBlockDialog({ open, onClose, onSelect }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const dialog = (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add a component"
    >
      <div
        className="absolute inset-0 bg-main/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-background shadow-xl ring-1 ring-200">
        <div className="flex items-center justify-between border-b border-200 px-5 py-4">
          <h2 className={`${typography.itemTitle} font-semibold text-main`}>
            Add a component
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-700 transition-colors hover:bg-100 hover:text-main"
          >
            <XIcon size={20} weight="regular" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-2">
            {BLOCK_LIBRARY.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-200 p-3 text-start transition-colors hover:border-primary-1 hover:bg-primary-1/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-1/10 text-primary-1">
                    <PlusIcon size={18} weight="bold" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={`${typography.body} font-semibold text-main`}
                    >
                      {item.label}
                    </span>
                    <span className={`${typography.caption} text-600`}>
                      {item.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
