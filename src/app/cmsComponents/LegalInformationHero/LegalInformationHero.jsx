"use client";

import LegalInformationHeroPanel from "./components/LegalInformationHeroPanel";
import { getLegalInformationHeroContent } from "./utils/helpers";
import { resolveLegalInformationHeroStyle } from "./utils/style";

/**
 * LegalInformationHero — full-bleed legal page hero with pattern overlay.
 */
export default function LegalInformationHero({
  lang = "en",
  data,
  style,
  title: titleProp,
  description: descriptionProp,
  patternUrl: patternUrlProp,
}) {
  const resolvedStyle = resolveLegalInformationHeroStyle(style);
  const content = getLegalInformationHeroContent(data, lang);
  const title = titleProp || content.title;
  const description = descriptionProp || content.description;
  const patternUrl = patternUrlProp || content.patternUrl;
  const links = content.links || [];

  if (!title && !description) {
    return null;
  }

  return (
    <LegalInformationHeroPanel
      lang={lang}
      title={title}
      description={description}
      links={links}
      patternUrl={patternUrl}
      style={resolvedStyle}
    />
  );
}
