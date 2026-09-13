"use client";

import ServiceBenefitsPanel from "./components/ServiceBenefitsPanel";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getServiceBenefitsContent } from "./utils/helpers";
import { resolveServiceBenefitsStyle } from "./utils/style";

export default function ServiceBenefitsList({ lang = "en", data, style }) {
  const resolvedStyle = resolveServiceBenefitsStyle(style);
  const { mainTitle, backgroundImage, links, benefits, hasContent } =
    getServiceBenefitsContent(data, lang);

  if (!hasContent) {
    return null;
  }

  const showLinks = resolvedStyle.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(benefits, links)
    : null;

  return (
    <ServiceBenefitsPanel
      mainTitle={mainTitle}
      backgroundImage={backgroundImage}
      benefits={benefits}
      itemLinkParts={itemLinkParts}
      style={resolvedStyle}
    />
  );
}
