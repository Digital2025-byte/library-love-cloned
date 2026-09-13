/**
 * Reorder an array immutably by moving an item from one index to another.
 */
export function reorderItems(items = [], fromIndex, toIndex) {
  const list = Array.isArray(items) ? items : [];
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }

  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/**
 * Remap open accordion indexes after a move so expanded panels stay correct.
 */
export function remapOpenIndexes(openIndexes, fromIndex, toIndex) {
  const next = new Set();

  openIndexes.forEach((index) => {
    if (index === fromIndex) {
      next.add(toIndex);
      return;
    }

    if (fromIndex < toIndex) {
      if (index > fromIndex && index <= toIndex) {
        next.add(index - 1);
      } else {
        next.add(index);
      }
      return;
    }

    if (index >= toIndex && index < fromIndex) {
      next.add(index + 1);
    } else {
      next.add(index);
    }
  });

  return next;
}
