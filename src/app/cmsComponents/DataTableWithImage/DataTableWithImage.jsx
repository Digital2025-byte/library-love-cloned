"use client";

import DataTableWithImagePanel from "./components/DataTableWithImagePanel";
import { getDataTableWithImageContent } from "./utils/helpers";
import { resolveDataTableWithImageStyle } from "./utils/style";

export default function DataTableWithImage({ lang = "en", data, style }) {
  const resolvedStyle = resolveDataTableWithImageStyle(style);
  const content = getDataTableWithImageContent(data, lang);

  if (!content.hasContent) {
    return null;
  }

  return (
    <DataTableWithImagePanel
      lang={lang}
      title={content.title}
      headers={content.headers}
      rows={content.rows}
      note={content.note}
      imageSrc={content.imageSrc}
      imageAlt={content.imageAlt}
      style={resolvedStyle}
    />
  );
}
