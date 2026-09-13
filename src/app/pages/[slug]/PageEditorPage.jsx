"use client";

import { useParams } from "next/navigation";
import CmsDemoChrome from "@/components/demo/CmsDemoChrome";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { PageBuilder, getPage } from "@/components/pageBuilder";

export default function PageEditorPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const page = getPage(slug);

  if (!page) {
    return (
      <CmsDemoChrome overlay={false} sectionIds={[]}>
        <PageContentContainer className="py-24">
          <h1 className={`${typography.pageTitle} font-semibold text-main`}>
            Page not found
          </h1>
          <p className={`${typography.body} mt-3 text-700`}>
            No page exists for “{slug}”.
          </p>
        </PageContentContainer>
      </CmsDemoChrome>
    );
  }

  return (
    <CmsDemoChrome overlay={false} sectionIds={[]}>
      <PageBuilder page={page} />
    </CmsDemoChrome>
  );
}
