"use client";

import { useRef } from "react";
import { typography } from "@/styles/typography";

export default function MediaUploadPanel({
  isDragging,
  onDraggingChange,
  onFiles,
  maxUploadLabel = "1 GB",
}) {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    onDraggingChange(false);
    onFiles(event.dataTransfer.files);
  };

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          onDraggingChange(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          onDraggingChange(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          onDraggingChange(false);
        }}
        onDrop={handleDrop}
        className={`flex w-full max-w-xl flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed px-6 py-16 text-center transition-colors ${
          isDragging
            ? "border-primary-1 bg-primary-1/5"
            : "border-300 bg-50"
        }`}
      >
        <p className={`${typography.sectionTitle} font-medium text-main`}>
          Drop files to upload
        </p>
        <p className={`${typography.caption} text-500`}>or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${typography.caption} cursor-pointer rounded-sm bg-primary-1 px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90`}
        >
          Select Files
        </button>
        <p className={`${typography.caption} mt-2 text-500`}>
          Maximum upload file size: {maxUploadLabel}.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            onFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
