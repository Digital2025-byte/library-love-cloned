"use client";

import { typography } from "@/styles/typography";

const TABS = [
  { id: "upload", label: "Upload files" },
  { id: "library", label: "Media Library" },
];

export default function MediaDialogTabs({
  tab,
  onTabChange,
  search,
  onSearchChange,
  showSearch = false,
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-200 px-4 pt-2">
      <div className="flex items-end gap-1" role="tablist" aria-label="Media source">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(item.id)}
              className={`${typography.caption} cursor-pointer border-b-2 px-3 py-2.5 transition-colors ${
                active
                  ? "border-primary-1 font-semibold text-primary-1"
                  : "border-transparent text-700 hover:text-main"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {showSearch ? (
        <label className="ms-auto flex min-w-[12rem] flex-1 items-center sm:max-w-xs">
          <span className="sr-only">Search media</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search media"
            className={`${typography.caption} w-full rounded-sm border border-200 bg-white px-2.5 py-1.5 text-foreground outline-none focus:border-800`}
          />
        </label>
      ) : null}
    </div>
  );
}
