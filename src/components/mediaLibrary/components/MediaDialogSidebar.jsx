"use client";

import { typography } from "@/styles/typography";

const ACTIONS = [
  { id: "insert", label: "Insert Media" },
  { id: "url", label: "Insert from URL" },
];

export default function MediaDialogSidebar({ action, onActionChange }) {
  return (
    <aside className="hidden w-44 shrink-0 border-e border-200 bg-50 p-4 sm:block">
      <p
        className={`${typography.caption} mb-3 font-medium uppercase tracking-wide text-500`}
      >
        Actions
      </p>
      <nav className="flex flex-col gap-0.5" aria-label="Media actions">
        {ACTIONS.map((item) => {
          const active = action === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onActionChange(item.id)}
              className={`${typography.caption} cursor-pointer rounded-sm px-2.5 py-2 text-start transition-colors ${
                active
                  ? "bg-white font-semibold text-main shadow-sm"
                  : "text-700 hover:bg-white/70 hover:text-main"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
