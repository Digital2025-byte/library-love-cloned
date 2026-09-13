"use client";

import { usePathname } from "next/navigation";
import CitiesSectionsPanel from "./components/CitiesSectionsPanel";
import { getCitiesSectionsContent } from "./utils/helpers";
import { resolveCitiesSectionsStyle } from "./utils/style";

function buildCtaHref(pathname = "", slug = "", explicitHref = "") {
  if (explicitHref && (explicitHref.startsWith("/") || explicitHref.startsWith("http") || explicitHref.startsWith("#"))) {
    return explicitHref;
  }
  if (!slug) {
    return explicitHref || "";
  }

  const path = String(pathname || "").replace(/\/$/, "");
  const normalizedSlug = String(slug).startsWith("/") ? slug : `/${slug}`;

  return `${path}${normalizedSlug}`;
}

export default function CitiesSections({
  lang = "en",
  data,
  style,
  cId,
  side,
}) {
  const pathname = usePathname();
  const content = getCitiesSectionsContent(data, lang);
  const resolvedStyle = resolveCitiesSectionsStyle(style, { side });

  if (!content.hasContent) {
    return null;
  }

  return (
    <CitiesSectionsPanel
      lang={lang}
      cId={cId}
      content={{
        ...content,
        ctaHref: buildCtaHref(pathname, content.slug, content.ctaHref),
      }}
      style={resolvedStyle}
    />
  );
}
