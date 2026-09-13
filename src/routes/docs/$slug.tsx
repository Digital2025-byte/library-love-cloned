import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JS component from the cloned app
import DocsComponentPage from "@/app/docs/[slug]/DocsComponentPage";

export const Route = createFileRoute("/docs/$slug")({
  head: () => ({
    meta: [
      { title: "Component docs — FlyCham CMS" },
      {
        name: "description",
        content:
          "Props, content options and live examples for this FlyCham CMS component.",
      },
      { property: "og:title", content: "Component docs — FlyCham CMS" },
      {
        property: "og:description",
        content:
          "Props, content options and live examples for this FlyCham CMS component.",
      },
    ],
  }),
  component: DocsComponentPage,
});
