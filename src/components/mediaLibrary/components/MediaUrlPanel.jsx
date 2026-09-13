"use client";

import { typography } from "@/styles/typography";
import { inspectorControlClass } from "@/components/inspector";

export default function MediaUrlPanel({ value, onChange }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-6">
      <label className="flex max-w-xl flex-col gap-1">
        <span className={`${typography.caption} font-medium text-main`}>
          Image URL
        </span>
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/image.jpg"
          className={inspectorControlClass}
        />
        <span className={`${typography.caption} text-500`}>
          Paste a direct link to an image file.
        </span>
      </label>
      {value ? (
        <div className="mt-2 max-w-md overflow-hidden rounded-sm border border-200 bg-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="URL preview"
            className="max-h-56 w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
