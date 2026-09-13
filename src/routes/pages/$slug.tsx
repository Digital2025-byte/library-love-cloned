import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JS component from the cloned app
import PageEditorPage from "@/app/pages/[slug]/PageEditorPage";

export const Route = createFileRoute("/pages/$slug")({
  head: () => ({
    meta: [
      { title: "Page editor — FlyCham CMS" },
      {
        name: "description",
        content: "Compose and preview a page from FlyCham CMS components.",
      },
      { property: "og:title", content: "Page editor — FlyCham CMS" },
      {
        property: "og:description",
        content: "Compose and preview a page from FlyCham CMS components.",
      },
    ],
  }),
  component: PageEditorPage,
});
