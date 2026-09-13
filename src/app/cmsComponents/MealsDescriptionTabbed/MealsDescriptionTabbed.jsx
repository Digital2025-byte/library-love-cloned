"use client";

import MealsDescriptionTabbedPanel from "./components/MealsDescriptionTabbedPanel";
import { getMealsDescriptionTabbedContent } from "./utils/helpers";
import { resolveMealsTabbedStyle } from "./utils/style";

export default function MealsDescriptionTabbed({ lang = "en", data, style }) {
  const content = getMealsDescriptionTabbedContent(data, lang);
  const resolvedStyle = resolveMealsTabbedStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <MealsDescriptionTabbedPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
