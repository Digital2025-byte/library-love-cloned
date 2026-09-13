"use client";

import ConnectionStepsListPanel from "./components/ConnectionStepsListPanel";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getConnectionStepsListContent } from "./utils/helpers";
import { resolveConnectionStepsListStyle } from "./utils/style";

export default function ConnectionStepsList({ lang = "en", data, style }) {
  const resolvedStyle = resolveConnectionStepsListStyle(style);
  const { title, links, steps, stepLabel, hasContent } =
    getConnectionStepsListContent(data, lang);

  if (!hasContent) {
    return null;
  }

  const showLinks = resolvedStyle.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(steps, links)
    : null;
  const stepsWithParts = steps.map((step, index) => ({
    ...step,
    bodyParts: itemLinkParts?.[index]?.bodyParts,
  }));

  return (
    <ConnectionStepsListPanel
      lang={lang}
      title={title}
      steps={stepsWithParts}
      stepLabelPrefix={stepLabel || (lang === "ar" ? "الخطوة" : "Step")}
      style={resolvedStyle}
    />
  );
}
