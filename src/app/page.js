"use client";

import csr from "@/components/csr/csr";

const HomePage = csr(() => import("./HomePage"));

export default function Page() {
  return <HomePage />;
}
