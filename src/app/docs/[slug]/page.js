"use client";

import csr from "@/components/csr/csr";

const DocsComponentPage = csr(() => import("./DocsComponentPage"));

export default function Page() {
  return <DocsComponentPage />;
}
