"use client";

import { useMemo, useState } from "react";
import { PlusIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import PageContentContainer from "@/components/layout/PageContentContainer";
import useCmsDemoData from "@/components/demo/useCmsDemoData";
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
    resetPage,
  } = usePageBlocks({ slug: page.slug, ctx, lang });

  const [activeUid, setActiveUid] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const activeBlock = useMemo(
    () => blocks.find((block) => block.uid === activeUid) || null,
    [blocks, activeUid]
  );
  const activeEntry = activeBlock ? getBlockEntry(activeBlock.sectionId) : null;
  const activeContent = activeBlock?.content?.[lang];

  const handleAdd = (sectionId) => {
    const uid = addBlock(sectionId);
    setIsAddOpen(false);
    if (uid) {
      setActiveUid(uid);
    }
  };

  const handleRemove = (uid) => {
    if (activeUid === uid) {
      setActiveUid(null);
    }
    removeBlock(uid);
  };

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
              className={`${typography.button} inline-flex items-center gap-2 rounded-lg bg-primary-1 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-2`}
            >
              <PlusIcon size={18} weight="bold" aria-hidden />
              Add component
            </button>
          </div>
        </PageContentContainer>
      </div>

      {blocks.length === 0 ? (
        <EmptyPageState onAdd={() => setIsAddOpen(true)} />
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
              className={`${typography.button} flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-300 py-5 font-medium text-600 transition-colors hover:border-primary-1 hover:text-primary-1`}
            >
              <PlusIcon size={20} weight="bold" aria-hidden />
              Add component
            </button>
          </PageContentContainer>
        </div>
      )}

      <AddBlockDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSelect={handleAdd}
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
          onContentChange={(content) =>
            updateBlockContent(activeBlock.uid, content)
          }
          onStyleChange={(style) => updateBlockStyle(activeBlock.uid, style)}
          onClose={() => setActiveUid(null)}
        />
      ) : null}
    </div>
  );
}
