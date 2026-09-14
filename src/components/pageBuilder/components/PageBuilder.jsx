"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlusIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
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

const SAVE_DEBOUNCE_MS = 500;

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
  const persistTimerRef = useRef(null);
  const pendingUpdateRef = useRef(null);

  const activeBlock = useMemo(
    () => blocks.find((block) => block.uid === activeUid) || null,
    [blocks, activeUid]
  );
  const activeEntry = activeBlock ? getBlockEntry(activeBlock.sectionId) : null;
  const activeContent = activeBlock?.content?.[lang];

  const flushComponentUpdate = () => {
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;
    }
    const pending = pendingUpdateRef.current;
    if (!pending || !isCmsComponentId(pending.uid)) {
      return;
    }
    pendingUpdateRef.current = null;
    const payload = {
      slug: pending.slug,
      uid: pending.uid,
    };
    if (pending.type) payload.type = pending.type;
    if (typeof pending.position === "number") payload.position = pending.position;
    if (pending.style) payload.style = pending.style;
    if (pending.content) payload.content = pending.content;
    updateComponent.mutate(payload);
  };

  const queueComponentUpdate = (patch) => {
    if (!patch?.uid || !isCmsComponentId(patch.uid)) {
      return;
    }
    const prev =
      pendingUpdateRef.current?.uid === patch.uid
        ? pendingUpdateRef.current
        : null;
    pendingUpdateRef.current = {
      slug: page.slug,
      uid: patch.uid,
      type: patch.sectionId ?? prev?.type,
      position:
        typeof patch.position === "number" ? patch.position : prev?.position,
      style:
        patch.style !== undefined ? { ...patch.style } : prev?.style,
      content:
        patch.content !== undefined
          ? { ...(prev?.content || {}), ...patch.content }
          : prev?.content,
    };
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
    }
    persistTimerRef.current = setTimeout(flushComponentUpdate, SAVE_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
    };
  }, []);

  const handleAdd = (sectionId) => {
    const entry = getBlockEntry(sectionId);
    if (!entry) {
      return;
    }
    const position = blocks.length;
    const uid = addBlock(sectionId);
    setIsAddOpen(false);
    if (uid) {
      setActiveUid(uid);
    }

    // Persist the new instance on this page in the backend.
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
    if (activeUid === uid) {
      setActiveUid(null);
    }
    if (pendingUpdateRef.current?.uid === uid) {
      pendingUpdateRef.current = null;
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
    }
    removeBlock(uid);
    if (isCmsComponentId(uid)) {
      deleteComponent.mutate({ slug: page.slug, uid });
    }
  };

  const handleContentChange = (content) => {
    if (!activeBlock) {
      return;
    }
    updateBlockContent(activeBlock.uid, content);
    queueComponentUpdate({
      uid: activeBlock.uid,
      sectionId: activeBlock.sectionId,
      position: activeBlock.position,
      content: { ...activeBlock.content, [lang]: content },
    });
  };

  const handleStyleChange = (style) => {
    if (!activeBlock) {
      return;
    }
    updateBlockStyle(activeBlock.uid, style);
    queueComponentUpdate({
      uid: activeBlock.uid,
      sectionId: activeBlock.sectionId,
      position: activeBlock.position,
      style,
    });
  };

  const handleInspectorClose = () => {
    flushComponentUpdate();
    setActiveUid(null);
  };

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
              className={`${typography.button} inline-flex items-center gap-2 rounded-lg bg-primary-1 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-2`}
            >
              <PlusIcon size={18} weight="bold" aria-hidden />
              Add component
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
      ) : updateComponent.isPending ? (
        <PageContentContainer className="pt-4">
          <p className={`${typography.caption} text-600`}>Saving…</p>
        </PageContentContainer>
      ) : null}

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
          onContentChange={handleContentChange}
          onStyleChange={handleStyleChange}
          onClose={handleInspectorClose}
        />
      ) : null}
    </div>
  );
}
