/**
 * ============================================================
 * MOBILE LAYOUT — edit small-screen zigzag + paths here
 * ============================================================
 * Desktop stays in layout.js. This file is only used below `md`.
 */

export const CONNECTION_STEPS_MOBILE_LAYOUT = {
  circleSize: 148,
  /** Space between circle rows — gives the slanted arcs room to show. */
  gapHeight: 56,

  path: {
    color: "#D1B883",
    strokeWidth: 2,
    dasharray: "1.5 9",

    /** Circle centers as % of track width. */
    leftX: 22,
    rightX: 78,

    /**
     * Ellipse radius used for rim exit/enter points + mask cutouts.
     * Keep roughly in sync with circleSize vs track size.
     */
    radiusPct: { x: 18, y: 9.5 },
    maskPadding: 1.08,

    /**
     * Exit / enter angles on the circle (deg: 0 = right, 90 = down).
     * Left→right: leave bottom-right, arrive top-left.
     * Right→left: leave bottom-left, arrive top-right.
     */
    leftToRight: { exitAngle: 55, enterAngle: 235 },
    rightToLeft: { exitAngle: 125, enterAngle: -55 },

    /**
     * How far the arc bows past the straight chord (in % of track).
     * Positive = pull toward the bottom of the gap (matches the design).
     */
    bow: 3.5,
  },
};

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Point on an axis-aligned ellipse at `angleDeg`. */
function ellipseRim(cx, cy, rx, ry, angleDeg) {
  const rad = degToRad(angleDeg);
  return {
    x: cx + rx * Math.cos(rad),
    y: cy + ry * Math.sin(rad),
  };
}

/**
 * Separate slanted arcs between circle rims (not through centers).
 * Each gap is its own subpath so the dash only shows in the open space.
 */
export function buildMobileZigzagPathD(
  stepCount,
  layout = CONNECTION_STEPS_MOBILE_LAYOUT,
  isRtl = false
) {
  if (stepCount < 2) {
    return "";
  }

  const { circleSize, gapHeight, path } = layout;
  const totalH = stepCount * circleSize + (stepCount - 1) * gapHeight;
  const { leftX, rightX, radiusPct, leftToRight, rightToLeft, bow = 5 } = path;
  const rx = radiusPct.x;
  const ry = radiusPct.y;

  const centers = Array.from({ length: stepCount }, (_, i) => {
    const slotOnLeft = i % 2 === 0;
    let x = slotOnLeft ? leftX : rightX;
    if (isRtl) {
      x = 100 - x;
    }
    const yPx = circleSize / 2 + i * (circleSize + gapHeight);
    return {
      x,
      y: (yPx / totalH) * 100,
      slotOnLeft,
    };
  });

  const parts = [];

  for (let i = 0; i < centers.length - 1; i += 1) {
    const a = centers[i];
    const b = centers[i + 1];
    // After RTL mirror, “going right” means increasing x
    const goingRight = b.x >= a.x;
    const angles = goingRight ? leftToRight : rightToLeft;

    const start = ellipseRim(a.x, a.y, rx, ry, angles.exitAngle);
    const end = ellipseRim(b.x, b.y, rx, ry, angles.enterAngle);

    // Bow the arc downward into the gap (slanted C-curve)
    const c1x = start.x + (end.x - start.x) * 0.35;
    const c1y = start.y + (end.y - start.y) * 0.2 + bow;
    const c2x = start.x + (end.x - start.x) * 0.65;
    const c2y = start.y + (end.y - start.y) * 0.8 + bow * 0.35;

    parts.push(
      [
        `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
        `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}`,
        `${c2x.toFixed(2)} ${c2y.toFixed(2)}`,
        `${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      ].join(" ")
    );
  }

  return parts.join(" ");
}

export function getMobileZigzagMaskCircles(
  stepCount,
  layout = CONNECTION_STEPS_MOBILE_LAYOUT,
  isRtl = false
) {
  const { circleSize, gapHeight, path } = layout;
  const totalH = stepCount * circleSize + (stepCount - 1) * gapHeight;
  const { leftX, rightX, radiusPct, maskPadding = 1 } = path;
  const rx = radiusPct.x * maskPadding;
  const ry = radiusPct.y * maskPadding;

  return Array.from({ length: stepCount }, (_, i) => {
    const slotOnLeft = i % 2 === 0;
    let cx = slotOnLeft ? leftX : rightX;
    if (isRtl) {
      cx = 100 - cx;
    }
    const yPx = circleSize / 2 + i * (circleSize + gapHeight);
    return {
      cx,
      cy: (yPx / totalH) * 100,
      rx,
      ry,
    };
  });
}

export function getMobileTrackHeightPx(
  stepCount,
  layout = CONNECTION_STEPS_MOBILE_LAYOUT
) {
  if (stepCount < 1) {
    return 0;
  }
  return stepCount * layout.circleSize + (stepCount - 1) * layout.gapHeight;
}
