import { createFileRoute } from "@tanstack/react-router";
import { pagesQueryOptions } from "@/queries/pages";
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
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(pagesQueryOptions()),
  component: PagesListPage,
  pendingComponent: () => (
    <div className="p-10 text-sm text-600">Loading pages…</div>
  ),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-10 text-sm text-600">
      Couldn’t load pages: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-sm text-600">No pages found.</div>,
});
