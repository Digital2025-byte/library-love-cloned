import {
  CaretDownIcon,
  CaretUpIcon,
  DotsSixVertical,
  TrashIcon,
} from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { inspectorControlClass, inspectorIconHoverClass } from "../constants";

export default function InspectorRepeaterItem({
  label,
  open,
  onToggle,
  onRemove,
  titleValue,
  onTitleChange,
  titlePlaceholder = "Tab title",
  dragHandleProps,
  itemProps,
  isDragging = false,
  isDropTarget = false,
  children,
}) {
  const editable = typeof onTitleChange === "function";
  const canDrag = Boolean(dragHandleProps?.draggable);

  return (
    <div
      className={`overflow-hidden rounded-sm border transition-colors ${
        isDropTarget
          ? "border-primary-1 bg-primary-1/5"
          : "border-200"
      } ${isDragging ? "opacity-60" : ""}`}
      {...(itemProps || {})}
    >
      <div className="group flex items-center bg-50">
        {canDrag ? (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Reorder ${label}`}
            className={`inline-flex cursor-grab touch-none select-none items-center px-1.5 py-2 text-500 hover:text-main active:cursor-grabbing ${inspectorIconHoverClass}`}
            onClick={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
              }
            }}
            {...dragHandleProps}
          >
            <DotsSixVertical
              size={16}
              weight="bold"
              aria-hidden
              className="pointer-events-none"
            />
          </span>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={editable ? `Toggle ${titleValue || label}` : undefined}
          className={`flex cursor-pointer items-center ${
            editable
              ? "px-2 py-2"
              : "min-w-0 flex-1 gap-2 px-3 py-2 text-start hover:bg-100"
          }`}
        >
          {open ? (
            <CaretUpIcon
              className="h-4 w-4 shrink-0 text-700"
              weight="bold"
              aria-hidden
            />
          ) : (
            <CaretDownIcon
              className="h-4 w-4 shrink-0 text-500"
              weight="bold"
              aria-hidden
            />
          )}
          {editable ? null : (
            <span
              className={`${typography.caption} truncate font-medium text-main`}
            >
              {label}
            </span>
          )}
        </button>
        {editable ? (
          <input
            type="text"
            value={titleValue || ""}
            placeholder={titlePlaceholder}
            aria-label={titlePlaceholder}
            onChange={(event) => onTitleChange(event.target.value)}
            className={`${inspectorControlClass} mx-1 my-1 min-w-0 flex-1 py-1.5`}
          />
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={`cursor-pointer px-2 py-2 text-500 hover:bg-200 hover:text-main ${inspectorIconHoverClass}`}
        >
          <TrashIcon size={14} weight="regular" aria-hidden />
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-3 border-t border-200 bg-white px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
