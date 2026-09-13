"use client";

import CmsDemoChrome from "@/components/demo/CmsDemoChrome";
import { CmsDemoSections } from "@/components/demo/CmsDemoSections";
import { HOME_SECTION_IDS } from "@/components/demo/ideaGroups";
import useCmsDemoData from "@/components/demo/useCmsDemoData";

export default function HomePage() {
  const ctx = useCmsDemoData(HOME_SECTION_IDS);

  return (
    <CmsDemoChrome overlay sectionIds={HOME_SECTION_IDS}>
      <CmsDemoSections ids={HOME_SECTION_IDS} ctx={ctx} />
    </CmsDemoChrome>
  );
}
