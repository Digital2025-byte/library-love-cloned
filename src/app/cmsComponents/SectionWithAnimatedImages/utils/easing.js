/**
 * Slow start until middle, then smooth acceleration.
 */
export function fallingCardEasing(t) {
  if (t < 0.5) {
    const normalized = t * 2;
    const eased = normalized * normalized * normalized;
    return eased * 0.5;
  }

  const normalized = (t - 0.5) * 2;
  const eased = 1 - Math.pow(1 - normalized, 3);
  return 0.5 + eased * 0.5;
}
