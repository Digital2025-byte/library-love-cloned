import ConnectionStep from "./ConnectionStep";
import { CONNECTION_STEPS_LAYOUT } from "../utils/layout";

const SLOT = 0;

/** Step 1 — high left; label sits top-right of the circle. */
export default function ConnectionStep1({
  step,
  stepLabel,
  isRtl = false,
  theme,
}) {
  const layout = CONNECTION_STEPS_LAYOUT.steps[SLOT];
  const x = isRtl ? 100 - layout.x : layout.x;

  return (
    <li
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${layout.y}%` }}
    >
      <ConnectionStep
        stepLabel={stepLabel}
        description={step?.description}
        bodyParts={step?.bodyParts}
        imageUrl={step?.imageUrl}
        imageAlt={step?.imageAlt}
        theme={theme}
        labelStyle={{
          top: layout.label.top,
          left: layout.label.left,
          transform: `translateX(${layout.label.translateX})`,
        }}
      />
    </li>
  );
}
