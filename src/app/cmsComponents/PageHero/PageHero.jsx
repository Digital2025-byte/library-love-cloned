"use client";

import PageHeroPanel from "./components/PageHeroPanel";
import { getPageHeroContent } from "./utils/helpers";
import { resolvePageHeroStyle } from "./utils/style";

export default function PageHero({ lang = "en", data, style }) {
  const content = getPageHeroContent(data, lang);
  const resolvedStyle = resolvePageHeroStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <PageHeroPanel content={content} style={resolvedStyle} />;
}
