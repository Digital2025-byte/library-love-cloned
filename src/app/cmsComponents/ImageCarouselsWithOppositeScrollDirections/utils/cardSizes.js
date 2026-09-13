const WIDE_INDEXES = new Set([1, 4]);

const SIZE_BY_MODE = {
  mixed: (index) =>
    WIDE_INDEXES.has(index) ? { w: 520, h: 350 } : { w: 320, h: 350 },
  compact: () => ({ w: 320, h: 350 }),
  wide: () => ({ w: 520, h: 350 }),
};

export function getCardSizeByIndex(index, size = "mixed") {
  const resolve = SIZE_BY_MODE[size] || SIZE_BY_MODE.mixed;
  return resolve(index);
}
