import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JS component from the cloned app
import HomePage from "@/app/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlyCham CMS — Component Library" },
      {
        name: "description",
        content:
          "Browse the FlyCham CMS component library: sections, banners, carousels and page building blocks.",
      },
      { property: "og:title", content: "FlyCham CMS — Component Library" },
      {
        property: "og:description",
        content:
          "Browse the FlyCham CMS component library: sections, banners, carousels and page building blocks.",
      },
    ],
  }),
  component: HomePage,
});
