"use client";

import { useState } from "react";
import { typography } from "@/styles/typography";
import {
  THEME_COLOR_GROUPS,
  getThemeColorCss,
  getThemeColorLabel,
} from "@/styles/themeColors";

export default function InspectorColor({
  label,
  value,
  onChange,
  groups = THEME_COLOR_GROUPS,
}) {
  const [open, setOpen] = useState(false);
  const selectedCss = getThemeColorCss(value);
  const selectedLabel = getThemeColorLabel(value);

  return (
    <div className="flex flex-col gap-2">
      <span className={`${typography.caption} text-700`}>{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`${typography.caption} flex cursor-pointer items-center gap-2 rounded-sm border border-200 bg-white px-2.5 py-2 text-start text-foreground hover:border-700`}
      >
        <span
          className="h-5 w-5 shrink-0 rounded-sm border border-200"
          style={{ backgroundColor: selectedCss }}
        />
        <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
      </button>
      {open ? (
        <div className="flex flex-col gap-2 rounded-sm border border-200 bg-50 p-2">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <span className={`${typography.caption} text-500`}>
                {group.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.colors.map((color) => {
                  const selected = value === color.value;

                  return (
                    <button
                      key={color.value}
                      type="button"
                      title={color.label}
                      aria-label={color.label}
                      aria-pressed={selected}
                      onClick={() => onChange(color.value)}
                      className={`h-6 w-6 shrink-0 cursor-pointer rounded-sm border ${
                        selected
                          ? "border-primary-1 ring-2 ring-primary-1 ring-offset-1"
                          : "border-200 hover:border-700"
                      }`}
                      style={{ backgroundColor: color.css }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
