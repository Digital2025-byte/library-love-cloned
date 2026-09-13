import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createCmsComponent, type CmsBlock, type Json } from "@/lib/cms.functions";
import { cmsQueryKeys } from "./pages";

export type CreateComponentInput = {
  slug: string;
  type: string;
  position?: number;
  style?: { [key: string]: Json };
  content?: { [key: string]: Json };
};

/** Create one component instance on a page (admin only) and refresh its reads. */
export function useCreateComponent() {
  const queryClient = useQueryClient();
  const create = useServerFn(createCmsComponent);

  return useMutation<CmsBlock, Error, CreateComponentInput>({
    mutationKey: ["cms", "components", "create"],
    mutationFn: (input) => create({ data: input }),
    onSuccess: (_block, input) => {
      queryClient.invalidateQueries({ queryKey: cmsQueryKeys.page(input.slug) });
      queryClient.invalidateQueries({ queryKey: cmsQueryKeys.pages });
    },
  });
}
