import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { CONNECTION_STEPS_LAYOUT } from "../utils/layout";
import {
  DEFAULT_CONNECTION_STEPS_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";
import ConnectionStep1 from "./ConnectionStep1";
import ConnectionStep2 from "./ConnectionStep2";
import ConnectionStep3 from "./ConnectionStep3";
import ConnectionStep4 from "./ConnectionStep4";
import ConnectionStepsListMobile from "./ConnectionStepsListMobile";
import ConnectionStepsPath from "./ConnectionStepsPath";

const STEP_COMPONENTS = [
  ConnectionStep1,
  ConnectionStep2,
  ConnectionStep3,
  ConnectionStep4,
];

export default function ConnectionStepsListPanel({
  lang = "en",
  title,
  steps = [],
  stepLabelPrefix = "Step",
  style = DEFAULT_CONNECTION_STEPS_STYLE,
}) {
  const isRtl = lang === "ar";
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className="w-full overflow-visible" dir={isRtl ? "rtl" : "ltr"}>
      {style.showTitle && title ? (
        <h2
          className={`${typography.sectionTitle} mb-8 font-semibold md:mb-12 ${alignClass}`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}

      <ConnectionStepsListMobile
        steps={steps}
        stepLabelPrefix={stepLabelPrefix}
        isRtl={isRtl}
        style={style}
      />

      <div
        className="relative hidden w-full overflow-visible md:block"
        style={{ height: CONNECTION_STEPS_LAYOUT.trackHeight }}
      >
        <div className="absolute inset-0 z-0">
          <ConnectionStepsPath isRtl={isRtl} />
        </div>

        <ol className="absolute inset-0 z-10 list-none">
          {STEP_COMPONENTS.map((StepComponent, index) => {
            const step = steps[index];
            if (!step) {
              return null;
            }

            return (
              <StepComponent
                key={`d-${step.description || index}`}
                step={step}
                stepLabel={`${stepLabelPrefix} ${index + 1}`}
                isRtl={isRtl}
                theme={style}
              />
            );
          })}
        </ol>
      </div>
    </div>
  );
}
