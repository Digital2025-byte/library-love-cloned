"use client";

import { useState } from "react";
import { ImageIcon, TrashIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import MediaLibraryDialog from "./MediaLibraryDialog";

/**
 * Inspector control that opens the Insert Media dialog.
 * onChange receives the selected image URL string (CMS-friendly).
 * onSelectMedia receives the full payload when you need alt/title too.
 */
export default function MediaField({
  id,
  label = "Image",
  value = "",
  onChange,
  onSelectMedia,
  chooseLabel = "Select image",
  clearLabel = "Remove",
}) {
  const [open, setOpen] = useState(false);
  const hasImage = Boolean(String(value || "").trim());

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className={`${typography.caption} text-700`} id={`${id}-label`}>
          {label}
        </span>
      ) : null}

      <div
        className="overflow-hidden rounded-sm border border-200 bg-50"
        aria-labelledby={label ? `${id}-label` : undefined}
      >
        {hasImage ? (
          <div className="relative aspect-[16/9] w-full bg-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 text-500">
            <ImageIcon size={28} weight="regular" aria-hidden />
            <span className={typography.caption}>No image selected</span>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-200 bg-white p-2">
          <button
            type="button"
            id={id}
            onClick={() => setOpen(true)}
            className={`${typography.caption} cursor-pointer rounded-sm bg-primary-1 px-3 py-1.5 font-semibold text-white transition-opacity hover:opacity-90`}
          >
            {hasImage ? "Replace image" : chooseLabel}
          </button>
          {hasImage ? (
            <button
              type="button"
              onClick={() => {
                onChange?.("");
                onSelectMedia?.(null);
              }}
              aria-label={clearLabel}
              className={`${typography.caption} inline-flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1.5 text-500 transition-colors hover:bg-100 hover:text-main`}
            >
              <TrashIcon size={14} weight="regular" aria-hidden />
              {clearLabel}
            </button>
          ) : null}
        </div>
      </div>

      <MediaLibraryDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        initialUrl={value}
        onSelect={(payload) => {
          onChange?.(payload.url);
          onSelectMedia?.(payload);
        }}
      />
    </div>
  );
}
