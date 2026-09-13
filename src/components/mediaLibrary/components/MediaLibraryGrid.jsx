"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";

export default function MediaLibraryGrid({ items = [], selectedId, onSelect }) {
  if (!items.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className={`${typography.caption} text-500`}>No media found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {items.map((item) => {
          const active = item.id === selectedId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={active}
                aria-label={item.alt || item.title}
                className={`group relative aspect-square w-full cursor-pointer overflow-hidden rounded-sm border bg-100 transition-shadow ${
                  active
                    ? "border-primary-1 ring-2 ring-primary-1/40"
                    : "border-200 hover:border-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {active ? (
                  <span className="absolute start-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-1 text-white shadow">
                    <CheckIcon size={12} weight="bold" aria-hidden />
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
