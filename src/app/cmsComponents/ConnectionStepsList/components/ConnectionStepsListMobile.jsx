import {
  CONNECTION_STEPS_MOBILE_LAYOUT,
  getMobileTrackHeightPx,
} from "../utils/layoutMobile";
import ConnectionStepMobile from "./ConnectionStepMobile";
import ConnectionStepsPathMobile from "./ConnectionStepsPathMobile";
import { DEFAULT_CONNECTION_STEPS_STYLE } from "../utils/style";

export default function ConnectionStepsListMobile({
  steps = [],
  stepLabelPrefix = "Step",
  isRtl = false,
  style = DEFAULT_CONNECTION_STEPS_STYLE,
}) {
  const { circleSize, gapHeight, path } = CONNECTION_STEPS_MOBILE_LAYOUT;
  const trackHeight = getMobileTrackHeightPx(steps.length);

  return (
    <div
      className="relative w-full overflow-visible md:hidden"
      style={{ height: trackHeight }}
    >
      <ConnectionStepsPathMobile stepCount={steps.length} isRtl={isRtl} />

      <ol className="absolute inset-0 z-10 list-none">
        {steps.map((step, index) => {
          const slotOnLeft = index % 2 === 0;
          const centerX = isRtl
            ? 100 - (slotOnLeft ? path.leftX : path.rightX)
            : slotOnLeft
              ? path.leftX
              : path.rightX;
          const imageOnLeft = isRtl ? !slotOnLeft : slotOnLeft;

          return (
            <li
              key={`mobile-step-${step.description || index}`}
              className="relative w-full"
              style={{
                height: circleSize,
                marginBottom: index === steps.length - 1 ? 0 : gapHeight,
              }}
            >
              <ConnectionStepMobile
                step={step}
                stepLabel={`${stepLabelPrefix} ${index + 1}`}
                imageOnLeft={imageOnLeft}
                circleSize={circleSize}
                centerX={centerX}
                theme={style}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
