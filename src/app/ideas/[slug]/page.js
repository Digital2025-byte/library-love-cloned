"use client";

import csr from "@/components/csr/csr";

const IdeaGroupPage = csr(() => import("./IdeaGroupPage"));

export default function Page() {
  return <IdeaGroupPage />;
}
