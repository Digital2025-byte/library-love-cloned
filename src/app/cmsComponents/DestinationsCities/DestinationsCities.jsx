"use client";

import DestinationsCitiesPanel from "./components/DestinationsCitiesPanel";
import { getDestinationsCitiesContent } from "./utils/helpers";
import { resolveDestinationsCitiesStyle } from "./utils/style";

export default function DestinationsCities({
  lang = "en",
  data,
  style,
  posParams = "gb",
}) {
  const content = getDestinationsCitiesContent(data, lang);
  const resolvedStyle = resolveDestinationsCitiesStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <DestinationsCitiesPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      posParams={posParams}
    />
  );
}
