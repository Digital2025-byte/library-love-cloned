"use client";

import { useId } from "react";
import {
  CONNECTION_STEPS_MOBILE_LAYOUT,
  buildMobileZigzagPathD,
  getMobileZigzagMaskCircles,
} from "../utils/layoutMobile";

/** Continuous dashed zigzag behind the mobile step circles. */
export default function ConnectionStepsPathMobile({
  stepCount = 4,
  isRtl = false,
}) {
  const maskId = useId().replace(/:/g, "");
  const { path } = CONNECTION_STEPS_MOBILE_LAYOUT;
  const d = buildMobileZigzagPathD(stepCount, CONNECTION_STEPS_MOBILE_LAYOUT, isRtl);
  const holes = getMobileZigzagMaskCircles(
    stepCount,
    CONNECTION_STEPS_MOBILE_LAYOUT,
    isRtl
  );

  if (!d) {
    return null;
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
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
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {holes.map((hole) => (
            <ellipse
              key={`mz-${hole.cx}-${hole.cy}`}
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
