import BlockToolbar from "./BlockToolbar";

function BlockSkeleton() {
  return (
    <div
      className="min-h-40 w-full animate-pulse bg-100/60"
      aria-hidden
    />
  );
}

/**
 * One block on the page: its live preview plus the hover toolbar.
 * The whole frame gets a soft outline on hover to signal it is editable.
 */
export default function PageBlockFrame({
  entry,
  block,
  content,
  lang,
  dir,
  isFirst,
  isLast,
  isActive,
  onEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
}) {
  const Section = entry.Section;

  return (
    <div
      className={`group relative outline-2 -outline-offset-2 transition-[outline-color] ${
        isActive ? "outline-primary-1" : "outline-transparent group-hover:outline-primary-1/40 hover:outline-primary-1/40"
      }`}
    >
      <BlockToolbar
        label={entry.label}
        isFirst={isFirst}
        isLast={isLast}
        onEdit={onEdit}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
      />

      {content ? (
        <Section
          lang={lang}
          dir={dir}
          data={entry.wrapContent(content, lang)}
          style={block.style}
          {...entry.sectionProps}
        />
      ) : (
        <BlockSkeleton />
      )}
    </div>
  );
}
