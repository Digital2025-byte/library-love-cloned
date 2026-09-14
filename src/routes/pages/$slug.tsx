import { createFileRoute } from "@tanstack/react-router";
import { pageQueryOptions } from "@/queries/pages";
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
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(pageQueryOptions(params.slug));
  },
  component: PageEditorPage,
  pendingComponent: () => (
    <div className="p-10 text-sm text-600">Loading page…</div>
  ),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-10 text-sm text-600">
      Couldn’t load page: {error.message}
    </div>
  ),
});
