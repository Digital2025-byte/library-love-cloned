"use client";

import ParagraphContent from "./components/ParagraphContent";
import { getParagraphContent } from "./utils/helpers";
import { resolveParagraphStyle } from "./utils/style";

export default function Paragraph({ lang = "en", data, style }) {
  const resolvedStyle = resolveParagraphStyle(style);
  const { title, description, links, hasContent } = getParagraphContent(
    data,
    lang
  );

  if (!hasContent) {
    return null;
  }

  return (
    <ParagraphContent
      title={title}
      description={description}
      links={links}
      style={resolvedStyle}
    />
  );
}
