"use client";

import { useParams } from "next/navigation";
import CmsDemoChrome from "@/components/demo/CmsDemoChrome";
import { CmsDemoSections } from "@/components/demo/CmsDemoSections";
import { getIdeaGroup } from "@/components/demo/ideaGroups";
import useCmsDemoData from "@/components/demo/useCmsDemoData";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";

export default function IdeaGroupPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const group = getIdeaGroup(slug);
  const sectionIds = group?.sectionIds ?? [];
  const ctx = useCmsDemoData(sectionIds);

  if (!group) {
    return (
      <CmsDemoChrome overlay={false} sectionIds={[]}>
        <PageContentContainer className="py-24">
          <h1 className={`${typography.pageTitle} font-semibold text-main`}>
            Idea not found
          </h1>
        </PageContentContainer>
      </CmsDemoChrome>
    );
  }

  return (
    <CmsDemoChrome overlay={false} sectionIds={group.sectionIds}>
      <CmsDemoSections ids={group.sectionIds} ctx={ctx} />
    </CmsDemoChrome>
  );
}
