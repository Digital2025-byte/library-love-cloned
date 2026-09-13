"use client";

import ContactCardsPanel from "./components/ContactCardsPanel";
import { getContactCardsContent } from "./utils/helpers";
import { resolveContactCardsStyle } from "./utils/style";

export default function ContactCards({ lang = "en", data, style }) {
  const content = getContactCardsContent(data, lang);
  const resolvedStyle = resolveContactCardsStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <ContactCardsPanel content={content} style={resolvedStyle} />;
}
