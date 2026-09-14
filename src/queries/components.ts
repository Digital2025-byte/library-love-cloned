import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createCmsComponent,
  deleteCmsComponent,
  updateCmsComponent,
  type CmsBlock,
  type CmsPublicBlock,
  type CreateCmsComponentInput,
  type DeleteCmsComponentInput,
  type DeleteCmsComponentResult,
  type UpdateCmsComponentInput,
} from "@/lib/cms.functions";
import { cmsQueryKeys } from "./pages";

export type CreateComponentInput = CreateCmsComponentInput;

export type UpdateComponentInput = UpdateCmsComponentInput;

export type DeleteComponentInput = DeleteCmsComponentInput;

/** True when the block id is a persisted `components.id` (uuid). */
export function isCmsComponentId(id: string | null | undefined): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}

function invalidatePage(
  queryClient: ReturnType<typeof useQueryClient>,
  slug: string,
) {
  queryClient.invalidateQueries({ queryKey: cmsQueryKeys.page(slug) });
  queryClient.invalidateQueries({ queryKey: cmsQueryKeys.pages });
}

/** Create one component instance on a page (admin only) and refresh its reads. */
export function useCreateComponent() {
  const queryClient = useQueryClient();
  const create = useServerFn(createCmsComponent);

  return useMutation<CmsBlock, Error, CreateComponentInput>({
    mutationKey: ["cms", "components", "create"],
    mutationFn: (input) => create({ data: input }),
    onSuccess: (_block, input) => {
      invalidatePage(queryClient, input.slug);
    },
  });
}

/** Persist full style + content for one component on a page (admin only). */
export function useUpdateComponent() {
  const queryClient = useQueryClient();
  const update = useServerFn(updateCmsComponent);

  return useMutation<CmsPublicBlock, Error, UpdateComponentInput>({
    mutationKey: ["cms", "components", "update"],
    mutationFn: (input) => update({ data: input }),
    onSuccess: (_block, input) => {
      invalidatePage(queryClient, input.slug);
    },
  });
}

/** Unlink a component from a page (admin only). Uses RPC, not the HTTP route. */
export function useDeleteComponent() {
  const queryClient = useQueryClient();
  const remove = useServerFn(deleteCmsComponent);

  return useMutation<DeleteCmsComponentResult, Error, DeleteComponentInput>({
    mutationKey: ["cms", "components", "delete"],
    mutationFn: (input) => remove({ data: input }),
    onSuccess: (_result, input) => {
      invalidatePage(queryClient, input.slug);
    },
  });
}
