"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBlockEntry } from "../registry/blockRegistry";
import { blockConfigSectionId, getPage } from "../pagesConfig";
import { createBlockUid } from "../utils/ids";
import {
  clearPageBlocks,
  loadPageBlocks,
  savePageBlocks,
} from "../utils/storage";

/** Normalize a block config (string id or object) into a full block. */
function blockFromConfig(config) {
  const sectionId = blockConfigSectionId(config);
  const entry = getBlockEntry(sectionId);
  if (!entry) {
    return null;
  }
  const preset = typeof config === "object" ? config : null;
  return {
    uid: createBlockUid(sectionId),
    sectionId,
    style: { ...entry.defaultStyle, ...(preset?.style || {}) },
    // Preset content seeds both languages up front; anything missing is
    // filled lazily from the component's demo data.
    content: preset?.content ? { ...preset.content } : {},
  };
}

/** Build the default composition for a page from its config. */
function seedBlocksFromConfig(slug) {
  const page = getPage(slug);
  if (!page) {
    return [];
  }
  return page.blocks.map(blockFromConfig).filter(Boolean);
}

/**
 * Owns the blocks that make up a page: load, persist, and mutate.
 *
 * @param {object}  args
 * @param {string}  args.slug   page slug
 * @param {object}  args.ctx    demo-data ctx from useCmsDemoData (per-block seed data)
 * @param {string}  args.lang   active language ("en" | "ar")
 */
export default function usePageBlocks({ slug, ctx, lang }) {
  const [blocks, setBlocks] = useState(() => {
    const stored = loadPageBlocks(slug);
    return stored ?? seedBlocksFromConfig(slug);
  });

  // Reload composition when the page changes.
  const slugRef = useRef(slug);
  useEffect(() => {
    if (slugRef.current === slug) {
      return;
    }
    slugRef.current = slug;
    setBlocks(loadPageBlocks(slug) ?? seedBlocksFromConfig(slug));
  }, [slug]);

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
      const block = {
        uid,
        sectionId,
        style: { ...entry.defaultStyle },
        content:
          data === undefined
            ? {}
            : { [lang]: entry.toEditorContent(data, lang) },
      };
      setBlocks((prev) => [...prev, block]);
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

  const resetPage = useCallback(() => {
    clearPageBlocks(slug);
    setBlocks(seedBlocksFromConfig(slug));
  }, [slug]);

  return {
    blocks,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlockContent,
    updateBlockStyle,
    resetPage,
  };
}
