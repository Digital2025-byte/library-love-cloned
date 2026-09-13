"use client";

import DestinationsMapPanel from "./components/DestinationsMapPanel";
import { getDestinationsMapContent } from "./utils/helpers";
import { resolveDestinationsMapStyle } from "./utils/style";

/**
 * DestinationsMap — interactive destinations map with routes, filters, and search.
 */
export default function DestinationsMap({ lang = "en", data, style }) {
  const resolvedStyle = resolveDestinationsMapStyle(style);
  const { cities, routes, labels, hasContent } = getDestinationsMapContent(
    data,
    lang
  );

  if (!hasContent) {
    return null;
  }

  return (
    <DestinationsMapPanel
      lang={lang}
      cities={cities}
      routes={routes}
      labels={labels}
      style={resolvedStyle}
    />
  );
}
