"use client";

import dynamic from "next/dynamic";

/** Load a page view in the browser only — no SSR / prerender. */
export default function csr(loader) {
  return dynamic(loader, { ssr: false });
}
