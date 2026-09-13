/**
 * ============================================================
 * EDIT POSITIONS HERE — single source of truth for desktop layout
 * ============================================================
 *
 * steps[].x / y  → circle CENTER as % of the desktop track (0–100)
 * steps[].label  → "Step N" offset relative to the circle box
 *
 * path.*         → dashed sine wave (masked out under each circle)
 * path.segments  → optional extra bend per gap (1→2, 2→3, 3→4)
 */

export const CONNECTION_STEPS_LAYOUT = {
  trackHeight: "26rem",
  circleSize: 140,

  path: {
    color: "#D1B883",
    strokeWidth: 2,
    dasharray: "1.5 9",
    /**
     * Ellipse used to MASK the stroke under each circle.
     * Match circleSize vs track size so the cutout hugs the photo.
     */
    radiusPct: { x: 6.2, y: 17.5 },
    /** Slightly larger than the photo so the dash never peeks under the rim. */
    maskPadding: 1.08,
    segments: [
      { bend: 0 },
      { bend: 0 },
      { bend: 0 },
    ],
  },

  steps: [
    {
      // high
      x: 12,
      y: 28,
      label: { top: "0", left: "100%", translateX: "-10%" },
    },
    {
      // low
      x: 37.5,
      y: 68,
      label: { top: "-1.75rem", left: "100%", translateX: "-10%" },
    },
    {
      // high
      x: 62.5,
      y: 28,
      label: { top: "0", left: "-25%", translateX: "-10%" },
    },
    {
      // low
      x: 88,
      y: 68,
      label: { top: "-1.75rem", left: "-25%", translateX: "0%" },
    },
  ],
};

/**
 * Continuous sine through circle centers.
 * Circles + SVG mask hide the stroke where it would cross each photo.
 */
export function buildConnectionPathD(
  layout = CONNECTION_STEPS_LAYOUT,
  isRtl = false
) {
  const points = layout.steps.map((step) => ({
    x: isRtl ? 100 - step.x : step.x,
    y: step.y,
  }));

  if (points.length < 2) {
    return "";
  }

  const segments = layout.path?.segments || [];
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const midX = (a.x + b.x) / 2;
    const bend = segments[i]?.bend ?? 0;

    // Horizontal handles → classic U / ∩ between high and low steps
    d += ` C ${midX} ${a.y + bend}, ${midX} ${b.y + bend}, ${b.x} ${b.y}`;
  }

  return d;
}

/** Circle centers in the same % space as the path (for the SVG mask). */
export function getConnectionMaskCircles(
  layout = CONNECTION_STEPS_LAYOUT,
  isRtl = false
) {
  const { radiusPct, maskPadding = 1 } = layout.path;
  const rx = radiusPct.x * maskPadding;
  const ry = radiusPct.y * maskPadding;

  return layout.steps.map((step) => ({
    cx: isRtl ? 100 - step.x : step.x,
    cy: step.y,
    rx,
    ry,
  }));
}
