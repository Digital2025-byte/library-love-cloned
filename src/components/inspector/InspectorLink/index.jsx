"use client";

import { useEffect } from "react";
import InspectorChoose from "../InspectorChoose";
import InspectorField from "../InspectorField";
import InspectorSelect from "../InspectorSelect";
import { LINK_TYPE_OPTIONS } from "../constants";
import { INTERNAL_PAGES } from "../pages";

function isPageHref(href, pages) {
  return pages.some((page) => page.href === href);
}

export default function InspectorLink({
  id,
  name = `${id}-type`,
  type,
  href,
  pages = INTERNAL_PAGES,
  onChange,
}) {
  const pageOptions = pages.map((page) => ({
    value: page.href,
    label: page.label,
  }));
  const fallbackHref = pages[0]?.href || "/";
  const isInternal = type === "internal";
  const hrefInPages = isPageHref(href, pages);

  // Keep stored href in sync with what the Page select displays
  useEffect(() => {
    if (!isInternal || hrefInPages || !fallbackHref) return;
    if (href === fallbackHref) return;
    onChange({ type: "internal", href: fallbackHref });
    // intentionally omit onChange — callers often pass an inline function
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync empty internal href once
  }, [isInternal, hrefInPages, href, fallbackHref]);

  const setType = (nextType) => {
    if (nextType === "internal") {
      onChange({
        type: "internal",
        href: hrefInPages ? href : fallbackHref,
      });
      return;
    }

    onChange({
      type: "external",
      href: hrefInPages ? "" : href,
    });
  };

  return (
    <>
      <InspectorChoose
        label="Link type"
        name={name}
        value={type}
        options={LINK_TYPE_OPTIONS}
        onChange={setType}
      />
      {isInternal ? (
        <InspectorSelect
          id={`${id}-page`}
          label="Page"
          value={hrefInPages ? href : fallbackHref}
          options={pageOptions}
          onChange={(value) => onChange({ type: "internal", href: value })}
        />
      ) : (
        <InspectorField
          id={`${id}-url`}
          label="URL"
          value={hrefInPages ? "" : href}
          onChange={(value) => onChange({ type: "external", href: value })}
        />
      )}
    </>
  );
}
