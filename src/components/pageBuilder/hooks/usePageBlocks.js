"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBlockEntry } from "../registry/blockRegistry";
import { createBlockUid } from "../utils/ids";
import { clearPageBlocks, savePageBlocks } from "../utils/storage";

/** Map CMS blocks from getCmsPage into the builder's local shape. */
function blocksFromCms(blocks) {
  if (!Array.isArray(blocks)) {
    return [];
  }
  return blocks.map((block, index) => ({
    uid: block.uid,
    sectionId: block.sectionId,
    position: typeof block.position === "number" ? block.position : index,
    style: { ...(block.style || {}) },
    content:
      block.content && typeof block.content === "object" && !Array.isArray(block.content)
        ? { ...block.content }
        : {},
  }));
}

function blocksSignature(blocks) {
  return (blocks ?? []).map((block) => block.uid).join("|");
}

/**
 * Owns the blocks that make up a page: load from the CMS, persist locally
 * while editing, and mutate.
 *
 * @param {object}  args
 * @param {string}  args.slug   page slug
 * @param {object}  args.ctx    demo-data ctx from useCmsDemoData (per-block seed data)
 * @param {string}  args.lang   active language ("en" | "ar")
 * @param {object[]} [args.initialBlocks] CMS blocks from getCmsPage
 */
export default function usePageBlocks({ slug, ctx, lang, initialBlocks }) {
  const [blocks, setBlocks] = useState(() => blocksFromCms(initialBlocks));

  // Reload when the page slug or the CMS component list changes.
  const slugRef = useRef(slug);
  const signatureRef = useRef(blocksSignature(initialBlocks));
  useEffect(() => {
    const signature = blocksSignature(initialBlocks);
    if (slugRef.current === slug && signatureRef.current === signature) {
      return;
    }
    slugRef.current = slug;
    signatureRef.current = signature;
    setBlocks(blocksFromCms(initialBlocks));
  }, [slug, initialBlocks]);

  // Lazily fill each block's content for the active language from demo data.
  useEffect(() => {
    setBlocks((prev) => {
      let changed = false;
      const next = prev.map((block) => {
        if (block.content?.[lang] !== undefined) {
          return block;
        }
        const entry = getBlockEntry(block.sectionId);
        const data = entry && ctx?.[entry.dataKey];
        if (!entry || data === undefined) {
          return block;
        }
        changed = true;
        return {
          ...block,
          content: {
            ...block.content,
            [lang]: entry.toEditorContent(data, lang),
          },
        };
      });
      return changed ? next : prev;
    });
  }, [ctx, lang]);

  // Persist on every change.
  useEffect(() => {
    savePageBlocks(slug, blocks);
  }, [slug, blocks]);

  const addBlock = useCallback(
    (sectionId) => {
      const entry = getBlockEntry(sectionId);
      if (!entry) {
        return;
      }
      const data = ctx?.[entry.dataKey];
      const uid = createBlockUid(sectionId);
      setBlocks((prev) => {
        const block = {
          uid,
          sectionId,
          position: prev.length,
          style: { ...entry.defaultStyle },
          content:
            data === undefined
              ? {}
              : { [lang]: entry.toEditorContent(data, lang) },
        };
        return [...prev, block];
      });
      return uid;
    },
    [ctx, lang]
  );

  const removeBlock = useCallback((uid) => {
    setBlocks((prev) => prev.filter((block) => block.uid !== uid));
  }, []);

  const moveBlock = useCallback((uid, direction) => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.uid === uid);
      if (index === -1) {
        return prev;
      }
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const updateBlockContent = useCallback(
    (uid, content) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.uid === uid
            ? { ...block, content: { ...block.content, [lang]: content } }
            : block
        )
      );
    },
    [lang]
  );

  const updateBlockStyle = useCallback((uid, style) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.uid === uid ? { ...block, style } : block
      )
    );
  }, []);

  const replaceBlock = useCallback((fromUid, next) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.uid === fromUid ? { ...block, ...next } : block
      )
    );
  }, []);

  const resetPage = useCallback(() => {
    clearPageBlocks(slug);
    setBlocks(blocksFromCms(initialBlocks));
  }, [slug, initialBlocks]);

  return {
    blocks,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlockContent,
    updateBlockStyle,
    replaceBlock,
    resetPage,
  };
}
