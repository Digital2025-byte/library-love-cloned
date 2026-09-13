"use client";

import { useId } from "react";
import {
  CONNECTION_STEPS_LAYOUT,
  buildConnectionPathD,
  getConnectionMaskCircles,
} from "../utils/layout";

/**
 * Continuous dashed gold sine wave through step centers.
 * An SVG mask punches out each circle so the stroke only shows in the gaps.
 */
export default function ConnectionStepsPath({ isRtl = false }) {
  const maskId = useId().replace(/:/g, "");
  const { path } = CONNECTION_STEPS_LAYOUT;
  const d = buildConnectionPathD(CONNECTION_STEPS_LAYOUT, isRtl);
  const holes = getConnectionMaskCircles(CONNECTION_STEPS_LAYOUT, isRtl);

  if (!d) {
    return null;
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100"
          height="100"
        >
          {/* White = stroke visible; black ellipses = hidden under photos */}
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {holes.map((hole) => (
            <ellipse
              key={`hole-${hole.cx}-${hole.cy}`}
              cx={hole.cx}
              cy={hole.cy}
              rx={hole.rx}
              ry={hole.ry}
              fill="black"
            />
          ))}
        </mask>
      </defs>

      <path
        d={d}
        stroke={path.color}
        strokeWidth={path.strokeWidth}
        strokeDasharray={path.dasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
