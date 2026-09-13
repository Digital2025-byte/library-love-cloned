"use client";

import DestinationShowcasePanel from "./components/DestinationShowcasePanel";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getDestinationShowcaseContent } from "./utils/helpers";
import { resolveDestinationShowcaseStyle } from "./utils/style";

export default function DestinationShowcase({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getDestinationShowcaseContent(data, lang, { posParams, cId });
  const resolvedStyle = resolveDestinationShowcaseStyle(style);

  if (!content.hasContent) {
    return null;
  }

  const showLinks = resolvedStyle.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(content.destinations, content.links, {
        titleKey: "name",
      })
    : null;
  const destinations = content.destinations.map((dest, index) => ({
    ...dest,
    titleParts: itemLinkParts?.[index]?.titleParts,
    bodyParts: itemLinkParts?.[index]?.bodyParts,
  }));

  return (
    <DestinationShowcasePanel
      lang={lang}
      content={{ ...content, destinations }}
      style={resolvedStyle}
    />
  );
}
