"use client";

import { SECTION_COMPONENTS } from "./sectionComponents";

export function CmsDemoSection({ id, ctx }) {
  const Section = SECTION_COMPONENTS[id];
  if (!Section) {
    return null;
  }

  return (
    <div id={id} className="scroll-mt-20">
      <Section {...ctx} />
    </div>
  );
}

export function CmsDemoSections({ ids, ctx }) {
  return ids.map((id) => <CmsDemoSection key={id} id={id} ctx={ctx} />);
}
