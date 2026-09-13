"use client";

import { useMemo } from "react";
import { typography } from "@/styles/typography";
import {
  getMatchCheckboxOptionsByCount,
  getSelectedMatchIndexes,
  serializeOccurrence,
} from "./core/model";

/**
 * Multi-select which phrase occurrences to link.
 */
export default function MatchPicker({
  idPrefix,
  matchCount,
  occurrence,
  onChange,
}) {
  const options = useMemo(
    () => getMatchCheckboxOptionsByCount(matchCount),
    [matchCount]
  );

  const selected = getSelectedMatchIndexes(occurrence, matchCount);
  const allSelected = matchCount > 0 && selected.length === matchCount;

  const setSelected = (nextIndexes) => {
    onChange(serializeOccurrence(nextIndexes, matchCount));
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected([1]);
      return;
    }
    setSelected(options.map((option) => option.value));
  };

  const toggleOne = (value) => {
    if (selected.includes(value)) {
      const next = selected.filter((index) => index !== value);
      setSelected(next.length ? next : [value]);
      return;
    }
    setSelected([...selected, value]);
  };

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={`${typography.caption} text-700`}>Which matches</legend>
      <div className="flex flex-col gap-2">
        <label
          className={`${typography.caption} flex cursor-pointer items-center gap-2 text-foreground`}
        >
          <input
            id={`${idPrefix}-all`}
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 shrink-0 cursor-pointer accent-foreground"
          />
          All matches ({matchCount})
        </label>
        <div className="flex flex-col gap-1.5 border-s border-200 ps-3">
          {options.map((option) => (
            <label
              key={option.value}
              className={`${typography.caption} flex cursor-pointer items-center gap-2 text-foreground`}
            >
              <input
                id={`${idPrefix}-${option.value}`}
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOne(option.value)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-foreground"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
