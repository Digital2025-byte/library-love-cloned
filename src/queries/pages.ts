import { queryOptions } from "@tanstack/react-query";
import { getCmsPages, type CmsPageSummary } from "@/lib/cms.functions";

export const cmsQueryKeys = {
  pages: ["cms", "pages"] as const,
  page: (slug: string) => ["cms", "page", slug] as const,
};

export const pagesQueryOptions = () =>
  queryOptions<CmsPageSummary[]>({
    queryKey: cmsQueryKeys.pages,
    queryFn: () => getCmsPages(),
    staleTime: 30_000,
  });
