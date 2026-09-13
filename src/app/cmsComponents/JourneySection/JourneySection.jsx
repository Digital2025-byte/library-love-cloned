"use client";

import JourneySectionPanel from "./components/JourneySectionPanel";
import { getJourneySectionContent } from "./utils/helpers";
import { resolveJourneySectionStyle } from "./utils/style";

export default function JourneySection({ lang = "en", data, style }) {
  const content = getJourneySectionContent(data, lang);
  const resolvedStyle = resolveJourneySectionStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <JourneySectionPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
