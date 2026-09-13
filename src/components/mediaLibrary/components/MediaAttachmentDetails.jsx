"use client";

import { typography } from "@/styles/typography";
import { inspectorControlClass } from "@/components/inspector";

export default function MediaAttachmentDetails({
  item,
  onChange,
  onDelete,
}) {
  if (!item) {
    return (
      <aside className="hidden w-72 shrink-0 border-s border-200 bg-white p-4 lg:block">
        <p className={`${typography.caption} text-500`}>
          Select an item to view attachment details.
        </p>
      </aside>
    );
  }

  const dimensions =
    item.width && item.height
      ? `${item.width} by ${item.height} pixels`
      : "—";

  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-s border-200 bg-white p-4 lg:block">
      <h3 className={`${typography.caption} mb-3 font-semibold text-main`}>
        Attachment Details
      </h3>

      <div className="mb-3 overflow-hidden rounded-sm border border-200 bg-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.alt || item.title}
          className="mx-auto max-h-36 w-full object-contain"
        />
      </div>

      <div className={`${typography.caption} mb-3 space-y-0.5 text-700`}>
        <p className="truncate font-medium text-main">{item.title}</p>
        <p>{item.uploadedAt}</p>
        <p>{item.sizeLabel}</p>
        <p>{dimensions}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          className={`${typography.caption} cursor-pointer text-primary-1 hover:underline`}
          onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
        >
          Edit Image
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={`${typography.caption} cursor-pointer text-red-600 hover:underline`}
        >
          Delete permanently
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className={`${typography.caption} text-700`}>Alt Text</span>
          <input
            type="text"
            value={item.alt || ""}
            onChange={(event) => onChange({ alt: event.target.value })}
            className={inspectorControlClass}
          />
          <span className={`${typography.caption} text-500`}>
            Describe the purpose of the image.
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className={`${typography.caption} text-700`}>Title</span>
          <input
            type="text"
            value={item.title || ""}
            onChange={(event) => onChange({ title: event.target.value })}
            className={inspectorControlClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={`${typography.caption} text-700`}>Caption</span>
          <textarea
            rows={2}
            value={item.caption || ""}
            onChange={(event) => onChange({ caption: event.target.value })}
            className={`${inspectorControlClass} resize-y`}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={`${typography.caption} text-700`}>Description</span>
          <textarea
            rows={2}
            value={item.description || ""}
            onChange={(event) => onChange({ description: event.target.value })}
            className={`${inspectorControlClass} resize-y`}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={`${typography.caption} text-700`}>File URL</span>
          <input
            type="text"
            readOnly
            value={item.url || ""}
            className={`${inspectorControlClass} bg-50 text-700`}
          />
          <button
            type="button"
            onClick={() => {
              if (item.url && navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(item.url);
              }
            }}
            className={`${typography.caption} cursor-pointer self-start text-primary-1 hover:underline`}
          >
            Copy URL to clipboard
          </button>
        </label>
      </div>
    </aside>
  );
}
