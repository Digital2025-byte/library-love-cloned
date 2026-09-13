import { PlusIcon, StackIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import PageContentContainer from "@/components/layout/PageContentContainer";

export default function EmptyPageState({ onAdd }) {
  return (
    <PageContentContainer className="py-20">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-1/10 text-primary-1">
          <StackIcon size={28} weight="regular" aria-hidden />
        </span>
        <h2 className={`${typography.itemTitle} font-semibold text-main`}>
          This page has no components yet
        </h2>
        <p className={`${typography.body} text-600`}>
          Add your first component to start building the page.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className={`${typography.button} inline-flex items-center gap-2 rounded-lg bg-primary-1 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-2`}
        >
          <PlusIcon size={18} weight="bold" aria-hidden />
          Add component
        </button>
      </div>
    </PageContentContainer>
  );
}
