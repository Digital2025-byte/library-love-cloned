"use client";

import { AnimatePresence, motion } from "framer-motion";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { MOVE_DURATION_S, MOVE_EASE } from "../utils/constants";
import { DEFAULT_DESTINATION_SHOWCASE_STYLE } from "../utils/style";

const titleVariants = {
  enter: (direction) => ({
    y: direction > 0 ? "110%" : "-110%",
  }),
  center: {
    y: 0,
  },
  exit: (direction) => ({
    y: direction > 0 ? "-110%" : "110%",
  }),
};

export default function DestinationShowcaseContent({
  name,
  description,
  titleParts,
  bodyParts,
  activeIndex,
  direction,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  const slideDirection = direction === 0 ? 1 : direction;
  const nameCss = getThemeColorCss(style.destNameColor, "50");
  const bodyCss = getThemeColorCss(style.destBodyColor, "50");
  const showLinks = style.showLinks !== false;

  if (!style.showDestinationName && !(style.showDestinationDescription && description)) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
      <div className="relative z-20">
        {style.showDestinationName ? (
          <div className="relative mb-4 overflow-hidden md:mb-6">
            <h3
              className="invisible text-4xl font-bold sm:text-4xl md:text-4xl lg:text-5xl"
              aria-hidden
            >
              {name || "\u00A0"}
            </h3>

            <AnimatePresence
              mode="sync"
              initial={false}
              custom={slideDirection}
            >
              <motion.h3
                key={activeIndex}
                custom={slideDirection}
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: MOVE_DURATION_S,
                  ease: MOVE_EASE,
                }}
                className="absolute inset-x-0 top-0 text-4xl font-bold sm:text-4xl md:text-4xl lg:text-5xl"
                style={{ color: nameCss }}
              >
                <LinkedText
                  text={name}
                  parts={titleParts}
                  style={style}
                  enabled={showLinks}
                />
              </motion.h3>
            </AnimatePresence>
          </div>
        ) : null}

        {style.showDestinationDescription && description ? (
          <p
            className={`${typography.body} mb-6 max-w-lg md:mb-6`}
            style={{
              color: `color-mix(in srgb, ${bodyCss} 90%, transparent)`,
            }}
          >
            <LinkedText
              text={description}
              parts={bodyParts}
              style={style}
              enabled={showLinks}
            />
          </p>
        ) : null}
      </div>
    </div>
  );
}
