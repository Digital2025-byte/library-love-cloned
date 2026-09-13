import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JS component from the cloned app
import PagesListPage from "@/app/pages/PagesListPage";

export const Route = createFileRoute("/pages/")({
  head: () => ({
    meta: [
      { title: "Pages — FlyCham CMS" },
      {
        name: "description",
        content: "All pages built with the FlyCham CMS component library.",
      },
      { property: "og:title", content: "Pages — FlyCham CMS" },
      {
        property: "og:description",
        content: "All pages built with the FlyCham CMS component library.",
      },
    ],
  }),
  component: PagesListPage,
});
