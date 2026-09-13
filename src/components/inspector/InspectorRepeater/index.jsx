"use client";

import InspectorAddButton from "../InspectorAddButton";
import InspectorRepeaterItem from "../InspectorRepeaterItem";
import useRepeater from "../useRepeater";
import useRepeaterDrag from "../useRepeaterDrag";

/**
 * Shared CMS item list. Drag handles reorder items for every consumer.
 * Pass sortable={false} to disable DnD for a specific repeater.
 */
export default function InspectorRepeater({
  items = [],
  onChange,
  createItem,
  itemLabel = (_item, index) => `Item ${index + 1}`,
  addLabel = "Add Item",
  titleKey,
  titlePlaceholder = "Tab title",
  sortable = true,
  children,
}) {
  const repeater = useRepeater({ items, onChange, createItem });
  const drag = useRepeaterDrag({
    enabled: sortable && items.length > 1,
    onMove: repeater.moveItem,
  });

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <InspectorRepeaterItem
          key={index}
          label={itemLabel(item, index)}
          open={repeater.isOpen(index)}
          onToggle={() => repeater.toggleItem(index)}
          onRemove={() => repeater.removeItem(index)}
          titleValue={titleKey ? item?.[titleKey] || "" : undefined}
          onTitleChange={
            titleKey
              ? (value) => repeater.updateItem(index, titleKey, value)
              : undefined
          }
          titlePlaceholder={titlePlaceholder}
          dragHandleProps={drag.getDragHandleProps(index)}
          itemProps={drag.getItemProps(index)}
          isDragging={drag.draggingIndex === index}
          isDropTarget={
            drag.overIndex === index && drag.draggingIndex !== index
          }
        >
          {children(item, {
            index,
            update: (key, value) => repeater.updateItem(index, key, value),
          })}
        </InspectorRepeaterItem>
      ))}
      <InspectorAddButton onClick={repeater.addItem}>{addLabel}</InspectorAddButton>
    </div>
  );
}
