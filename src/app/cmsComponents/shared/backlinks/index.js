/**
 * Shared Backlinks kit — use the same API in any CMS component.
 *
 * ---------------------------------------------------------------------------
 * 1) CONTENT MODEL (utils/helpers.js)
 * ---------------------------------------------------------------------------
 *   import { normalizeBacklinks, toEditorBacklinks } from "@/app/cmsComponents/shared/backlinks";
 *
 *   // getContent / wrapContent
 *   links: normalizeBacklinks(content.links)
 *   // optional per-item: links: normalizeBacklinks(item.links)
 *
 *   // getEditorContent
 *   links: toEditorBacklinks(content.links)
 *
 * ---------------------------------------------------------------------------
 * 2) CONTENT FORM
 * ---------------------------------------------------------------------------
 *   import { BacklinksEditor, joinBacklinkSourceText, joinItemBacklinkSourceText } from "...";
 *
 *   // Simple (Paragraph-like) — match against one field:
 *   <BacklinksEditor
 *     links={content.links || []}
 *     sourceText={content.description || ""}
 *     onChange={(links) => onChange({ ...content, links })}
 *   />
 *
 *   // Items (Accordion-like) — match across section + item title/body:
 *   <BacklinksEditor
 *     links={content.links || []}
 *     sourceText={joinItemBacklinkSourceText({
 *       description: content.description,
 *       items: content.items,
 *     })}
 *     onChange={(links) => onChange({ ...content, links })}
 *   />
 *
 * ---------------------------------------------------------------------------
 * 3) STYLE (utils/style.js + PropsForm)
 * ---------------------------------------------------------------------------
 *   import {
 *     DEFAULT_BACKLINK_STYLE,
 *     BACKLINK_STYLE_RESET_KEYS,
 *     resolveBacklinkStyle,
 *     BacklinksStyleSection,
 *   } from "...";
 *
 *   export const DEFAULT_X_STYLE = { ...other, ...DEFAULT_BACKLINK_STYLE };
 *   export function resolveXStyle(style = {}) {
 *     return resolveBacklinkStyle({ ...DEFAULT_X_STYLE, ...style }, DEFAULT_X_STYLE);
 *   }
 *
 *   <BacklinksStyleSection
 *     style={style}
 *     onChange={onChange}
 *     onReset={() => reset(BACKLINK_STYLE_RESET_KEYS)}
 *   />
 *
 * ---------------------------------------------------------------------------
 * 4) RENDER
 * ---------------------------------------------------------------------------
 *   import { LinkedText, buildItemBacklinkParts } from "...";
 *
 *   // Simple field:
 *   <LinkedText
 *     text={description}
 *     links={links}
 *     style={resolved}
 *     enabled={resolved.showLinks !== false}
 *   />
 *
 *   // Item list (shared section links + per-item links):
 *   const parts = buildItemBacklinkParts(items, sectionLinks);
 *   <LinkedText parts={parts[i].titleParts} style={resolved} />
 *   <LinkedText parts={parts[i].bodyParts} style={resolved} />
 */

// --- Content model ---------------------------------------------------------
export {
  emptyBacklink,
  normalizeBacklinks,
  normalizeParagraphLinks,
  toEditorBacklinks,
} from "./core/model";

// --- Editor helpers --------------------------------------------------------
export {
  countPhraseOccurrences,
  findNextPhraseIndex,
  findNextPhraseMatch,
  getMatchCheckboxOptions,
  getMatchCheckboxOptionsByCount,
  getOccurrenceOptions,
  getSelectedMatchIndexes,
  getWordSuggestionsFromText,
  normalizeOccurrence,
  occurrenceIncludes,
  serializeOccurrence,
} from "./core/model";

export {
  joinBacklinkSourceText,
  joinItemBacklinkSourceText,
} from "./core/sourceText";

// --- Style -----------------------------------------------------------------
export {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  LINK_UNDERLINE_OPTIONS,
  resolveBacklinkStyle,
  resolveBacklinkUnderline,
  withBacklinkStyleDefaults,
} from "./core/style";

// --- Render ----------------------------------------------------------------
export {
  buildAccordionItemLinkParts,
  buildItemBacklinkParts,
  buildLinkedTextParts,
} from "./core/build";

// --- UI --------------------------------------------------------------------
export { default as LinkedText } from "./LinkedText";
export { default as BacklinksEditor } from "./BacklinksEditor";
export { default as BacklinksStyleSection } from "./BacklinksStyleSection";
export { default as MatchPicker } from "./MatchPicker";
