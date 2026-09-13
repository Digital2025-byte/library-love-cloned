"use client";

import TrackRequestPanel from "./components/TrackRequestPanel";
import { getTrackRequestContent } from "./utils/helpers";
import { resolveTrackRequestStyle } from "./utils/style";

export default function TrackRequest({ lang = "en", data, style }) {
  const content = getTrackRequestContent(data, lang);
  const resolvedStyle = resolveTrackRequestStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <TrackRequestPanel content={content} style={resolvedStyle} />;
}
