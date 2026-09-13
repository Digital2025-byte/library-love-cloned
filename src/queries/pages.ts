import { queryOptions } from "@tanstack/react-query";
import {
  getCmsPage,
  getCmsPages,
  type CmsPageDetail,
  type CmsPageSummary,
} from "@/lib/cms.functions";

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

export const pageQueryOptions = (slug: string) =>
  queryOptions<CmsPageDetail | null>({
    queryKey: cmsQueryKeys.page(slug),
    queryFn: () => getCmsPage({ data: { slug } }),
    staleTime: 30_000,
  });

