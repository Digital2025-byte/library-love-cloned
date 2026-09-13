"use client";

import { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import InspectorReset from "../InspectorReset";
import { inspectorIconHoverClass } from "../constants";

export default function InspectorSection({
  title,
  defaultOpen = true,
  onReset,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen((value) => !value);

  return (
    <section className="border-b border-200">
      <div className="group flex items-center bg-100 hover:bg-200">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-center px-4 py-2.5 text-start"
        >
          <span className={`${typography.caption} font-semibold text-main`}>
            {title}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5 pr-3">
          {onReset ? (
            <InspectorReset
              iconOnly
              className={inspectorIconHoverClass}
              onClick={(event) => {
                event.stopPropagation();
                onReset();
              }}
            >
              {`Reset ${title}`}
            </InspectorReset>
          ) : null}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-700 hover:text-main"
          >
            {open ? (
              <CaretUpIcon className="h-4 w-4" weight="bold" aria-hidden />
            ) : (
              <CaretDownIcon className="h-4 w-4" weight="bold" aria-hidden />
            )}
          </button>
        </div>
      </div>
      {open ? (
        <div className="flex flex-col gap-3 bg-white px-4 py-3">{children}</div>
      ) : null}
    </section>
  );
}
