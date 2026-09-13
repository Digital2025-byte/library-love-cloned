"use client";

import { useMemo, useState } from "react";
import { typography } from "@/styles/typography";
import { inspectorControlClass } from "../constants";

function normalizeMatch(value) {
  return String(value || "").toLowerCase();
}

/**
 * Text field with Tab autocomplete.
 * Shows a ghost suffix for the current match; Tab accepts (or cycles matches).
 */
export default function InspectorAutocompleteField({
  id,
  label,
  value,
  onChange,
  suggestions = [],
  placeholder = "",
}) {
  const [matchIndex, setMatchIndex] = useState(0);
  const query = String(value || "");
  const normalizedQuery = normalizeMatch(query);

  const matches = useMemo(() => {
    if (!normalizedQuery) return [];

    const seen = new Set();
    const next = [];

    for (const suggestion of suggestions) {
      const text = String(suggestion || "");
      const key = normalizeMatch(text);
      if (!key || seen.has(key)) continue;
      if (!key.startsWith(normalizedQuery)) continue;
      seen.add(key);
      next.push(text);
    }

    return next;
  }, [suggestions, normalizedQuery]);

  const activeIndex =
    matches.length === 0 ? 0 : ((matchIndex % matches.length) + matches.length) % matches.length;
  const activeMatch = matches[activeIndex] || "";
  const ghostSuffix =
    activeMatch && normalizeMatch(activeMatch) !== normalizedQuery
      ? activeMatch.slice(query.length)
      : "";

  const acceptOrCycle = () => {
    if (!matches.length) return;

    const exactIndex = matches.findIndex(
      (match) => normalizeMatch(match) === normalizedQuery
    );

    if (exactIndex >= 0 && matches.length > 1) {
      const nextIndex = (exactIndex + 1) % matches.length;
      setMatchIndex(nextIndex);
      onChange(matches[nextIndex]);
      return;
    }

    if (activeMatch && normalizeMatch(activeMatch) !== normalizedQuery) {
      onChange(activeMatch);
      setMatchIndex(activeIndex);
    }
  };

  return (
    <label className="flex flex-col gap-1" htmlFor={id}>
      <span className={`${typography.caption} text-700`}>{label}</span>
      <div className="relative">
        {ghostSuffix ? (
          <div
            aria-hidden="true"
            className={`${inspectorControlClass} pointer-events-none absolute inset-0 border-transparent bg-transparent text-400`}
          >
            <span className="whitespace-pre text-transparent">{query}</span>
            <span className="whitespace-pre">{ghostSuffix}</span>
          </div>
        ) : null}
        <input
          id={id}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setMatchIndex(0);
            onChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) {
              return;
            }
            if (!matches.length) return;
            event.preventDefault();
            acceptOrCycle();
          }}
          className={`${inspectorControlClass} relative z-10 cursor-text bg-transparent`}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </label>
  );
}
