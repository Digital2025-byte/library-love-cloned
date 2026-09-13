import {
  ArrowUpIcon,
  ArrowDownIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";

function ToolbarButton({ onClick, disabled, label, tone = "default", children }) {
  const toneClass =
    tone === "primary"
      ? "text-primary-1 hover:bg-primary-1/10"
      : tone === "danger"
        ? "text-alert hover:bg-alert/10"
        : "text-700 hover:bg-100";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${toneClass}`}
    >
      {children}
    </button>
  );
}

/**
 * Floating controls shown over a block on hover/focus:
 * a name chip on one side, action buttons on the other.
 */
export default function BlockToolbar({
  label,
  isFirst,
  isLast,
  onEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      <span className="pointer-events-auto rounded-md bg-main/85 px-2 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
        {label}
      </span>
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg bg-white/95 p-1 shadow-md ring-1 ring-200 backdrop-blur">
        <ToolbarButton
          onClick={onMoveUp}
          disabled={isFirst}
          label="Move up"
        >
          <ArrowUpIcon size={18} weight="bold" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          onClick={onMoveDown}
          disabled={isLast}
          label="Move down"
        >
          <ArrowDownIcon size={18} weight="bold" aria-hidden />
        </ToolbarButton>
        <ToolbarButton onClick={onEdit} label="Edit component" tone="primary">
          <PencilSimpleIcon size={18} weight="bold" aria-hidden />
        </ToolbarButton>
        <ToolbarButton onClick={onRemove} label="Remove component" tone="danger">
          <TrashIcon size={18} weight="bold" aria-hidden />
        </ToolbarButton>
      </div>
    </div>
  );
}
