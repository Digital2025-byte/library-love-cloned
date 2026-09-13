import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JS component from the cloned app
import IdeaGroupPage from "@/app/ideas/[slug]/IdeaGroupPage";

export const Route = createFileRoute("/ideas/$slug")({
  head: () => ({
    meta: [
      { title: "Idea group — FlyCham CMS" },
      {
        name: "description",
        content: "Grouped layout ideas assembled from FlyCham CMS components.",
      },
      { property: "og:title", content: "Idea group — FlyCham CMS" },
      {
        property: "og:description",
        content: "Grouped layout ideas assembled from FlyCham CMS components.",
      },
    ],
  }),
  component: IdeaGroupPage,
});
