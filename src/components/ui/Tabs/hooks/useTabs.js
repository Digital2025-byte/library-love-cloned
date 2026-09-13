"use client";

import { useState } from "react";

export default function useTabs({ defaultValue, value, onChange } = {}) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);

  const selected = isControlled ? value : uncontrolled;

  const select = (next) => {
    if (!isControlled) {
      setUncontrolled(next);
    }
    onChange?.(next);
  };

  return { selected, select };
}
