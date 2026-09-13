"use client";

import CmsDemoChrome from "@/components/demo/CmsDemoChrome";
import { PagesList } from "@/components/pageBuilder";

export default function PagesListPage() {
  return (
    <CmsDemoChrome overlay={false} sectionIds={[]}>
      <PagesList />
    </CmsDemoChrome>
  );
}
