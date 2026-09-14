"use client";

import { useMemo, useState } from "react";
import { PlusIcon, ArrowCounterClockwiseIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import PageContentContainer from "@/components/layout/PageContentContainer";
import useCmsDemoData from "@/components/demo/useCmsDemoData";
import {
  isCmsComponentId,
  useCreateComponent,
  useDeleteComponent,
  useUpdateComponent,
} from "@/queries/components";
import { getBlockEntry, REGISTRY_BLOCK_IDS } from "../registry/blockRegistry";
import usePageBlocks from "../hooks/usePageBlocks";
import PageBlockFrame from "./PageBlockFrame";
import BlockInspectorDrawer from "./BlockInspectorDrawer";
import AddBlockDialog from "./AddBlockDialog";
import EmptyPageState from "./EmptyPageState";

export default function PageBuilder({ page }) {
  // Preload demo data for every addable block so adding is instant.
  const ctx = useCmsDemoData(REGISTRY_BLOCK_IDS);
  const { lang, dir } = ctx;

  const {
    blocks,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlockContent,
    updateBlockStyle,
    replaceBlock,
    resetPage,
  } = usePageBlocks({ slug: page.slug, ctx, lang, initialBlocks: page.blocks });

  const [activeUid, setActiveUid] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const createComponent = useCreateComponent();
  const updateComponent = useUpdateComponent();
  const deleteComponent = useDeleteComponent();

  const activeBlock = useMemo(
    () => blocks.find((block) => block.uid === activeUid) || null,
    [blocks, activeUid]
  );
  const activeEntry = activeBlock ? getBlockEntry(activeBlock.sectionId) : null;
  const activeContent = activeBlock?.content?.[lang];

  const handleAdd = (sectionId) => {
    if (createComponent.isPending) {
      return;
    }
    const entry = getBlockEntry(sectionId);
    if (!entry) {
      return;
    }
    const position = blocks.length;
    const uid = addBlock(sectionId);
    if (uid) {
      setActiveUid(uid);
    }

    const data = ctx?.[entry.dataKey];
    createComponent.mutate(
      {
        slug: page.slug,
        type: sectionId,
        position,
        style: { ...entry.defaultStyle },
        content:
          data === undefined
            ? {}
            : { [lang]: entry.toEditorContent(data, lang) },
      },
      {
        onSuccess: (block) => {
          setIsAddOpen(false);
          replaceBlock(uid, {
            uid: block.uid,
            sectionId: block.sectionId,
            position: block.position,
            style: block.style,
            content: block.content,
          });
          setActiveUid(block.uid);
        },
      },
    );
  };

  const handleRemove = (uid) => {
    if (deleteComponent.isPending) {
      return;
    }
    if (!isCmsComponentId(uid)) {
      if (activeUid === uid) {
        setActiveUid(null);
      }
      removeBlock(uid);
      return;
    }
    deleteComponent.mutate(
      { slug: page.slug, uid },
      {
        onSuccess: () => {
          if (activeUid === uid) {
            setActiveUid(null);
          }
          removeBlock(uid);
        },
      },
    );
  };

  const handleSubmitEdits = async () => {
    if (!activeBlock) {
      setActiveUid(null);
      return;
    }
    if (!isCmsComponentId(activeBlock.uid)) {
      setActiveUid(null);
      return;
    }
    try {
      await updateComponent.mutateAsync({
        slug: page.slug,
        uid: activeBlock.uid,
        type: activeBlock.sectionId,
        position: activeBlock.position,
        style: { ...(activeBlock.style || {}) },
        content: { ...(activeBlock.content || {}) },
      });
      setActiveUid(null);
    } catch {
      // Keep the inspector open so the error banner is visible.
    }
  };

  const handleDismissInspector = () => {
    if (updateComponent.isPending) {
      return;
    }
    setActiveUid(null);
  };

  const handleContentChange = (content) => {
    if (!activeBlock) {
      return;
    }
    updateBlockContent(activeBlock.uid, content);
  };

  const handleStyleChange = (style) => {
    if (!activeBlock) {
      return;
    }
    updateBlockStyle(activeBlock.uid, style);
  };

  const isCreating = createComponent.isPending;
  const isSaving = updateComponent.isPending;
  const removingUid = deleteComponent.isPending
    ? deleteComponent.variables?.uid
    : null;

  const saveError = createComponent.isError
    ? `Couldn’t save the new component: ${createComponent.error.message}`
    : updateComponent.isError
      ? `Couldn’t save component edits: ${updateComponent.error.message}`
      : deleteComponent.isError
        ? `Couldn’t remove the component: ${deleteComponent.error.message}`
        : null;

  return (
    <div className="pb-24">
      <div className="border-b border-200 bg-50">
        <PageContentContainer className="flex flex-wrap items-end justify-between gap-4 py-6">
          <div className="min-w-0">
            <p className={`${typography.caption} text-500`}>Page</p>
            <h1
              className={`${typography.pageTitle} mt-1 font-semibold text-main`}
            >
              {page.label}
            </h1>
            {page.description ? (
              <p className={`${typography.body} mt-1 text-700`}>
                {page.description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={resetPage}
              className={`${typography.button} inline-flex items-center gap-2 rounded-lg border border-200 px-4 py-2 font-medium text-700 transition-colors hover:bg-100`}
            >
              <ArrowCounterClockwiseIcon size={18} weight="bold" aria-hidden />
              Reset
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              disabled={isCreating}
              aria-busy={isCreating || undefined}
              className={`${typography.button} inline-flex items-center gap-2 rounded-lg bg-primary-1 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-2 disabled:cursor-wait disabled:opacity-60`}
            >
              {isCreating ? (
                <CircleNotchIcon size={18} weight="bold" className="animate-spin" aria-hidden />
              ) : (
                <PlusIcon size={18} weight="bold" aria-hidden />
              )}
              {isCreating ? "Adding…" : "Add component"}
            </button>
          </div>
        </PageContentContainer>
      </div>

      {saveError ? (
        <PageContentContainer className="pt-4">
          <p role="alert" className={`${typography.caption} text-red-600`}>
            {saveError}
          </p>
        </PageContentContainer>
      ) : null}

      {blocks.length === 0 ? (
        <EmptyPageState
          onAdd={() => setIsAddOpen(true)}
          isCreating={isCreating}
        />
      ) : (
        // Source help pages render on a bg-100 page, so white section cards
        // (JourneySection, HelpCategories, GetInTouch…) read as cards.
        <div className="bg-100">
          {blocks.map((block, index) => {
            const entry = getBlockEntry(block.sectionId);
            if (!entry) {
              return null;
            }
            return (
              <PageBlockFrame
                key={block.uid}
                entry={entry}
                block={block}
                content={block.content?.[lang]}
                lang={lang}
                dir={dir}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                isActive={block.uid === activeUid}
                isRemoving={removingUid === block.uid}
                onEdit={() => setActiveUid(block.uid)}
                onMoveUp={() => moveBlock(block.uid, "up")}
                onMoveDown={() => moveBlock(block.uid, "down")}
                onRemove={() => handleRemove(block.uid)}
              />
            );
          })}

          <PageContentContainer className="py-8">
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              disabled={isCreating}
              aria-busy={isCreating || undefined}
              className={`${typography.button} flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-300 py-5 font-medium text-600 transition-colors hover:border-primary-1 hover:text-primary-1 disabled:cursor-wait disabled:opacity-60`}
            >
              {isCreating ? (
                <CircleNotchIcon size={20} weight="bold" className="animate-spin" aria-hidden />
              ) : (
                <PlusIcon size={20} weight="bold" aria-hidden />
              )}
              {isCreating ? "Adding…" : "Add component"}
            </button>
          </PageContentContainer>
        </div>
      )}

      <AddBlockDialog
        open={isAddOpen}
        onClose={() => {
          if (!isCreating) setIsAddOpen(false);
        }}
        onSelect={handleAdd}
        isCreating={isCreating}
        creatingType={createComponent.variables?.type ?? null}
      />

      {activeBlock && activeEntry && activeContent !== undefined ? (
        <BlockInspectorDrawer
          key={activeBlock.uid}
          entry={activeEntry}
          content={activeContent}
          contentDefaults={activeEntry.toEditorContent(
            ctx[activeEntry.dataKey],
            lang
          )}
          style={activeBlock.style}
          onContentChange={handleContentChange}
          onStyleChange={handleStyleChange}
          onSubmit={handleSubmitEdits}
          onClose={handleDismissInspector}
          isSaving={isSaving}
        />
      ) : null}
    </div>
  );
}
