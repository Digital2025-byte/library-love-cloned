"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import DualImageTextContent from "./DualImageTextContent";
import {
  DEFAULT_DUAL_IMAGE_TEXT_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function DualImageTextPanel({
  lang = "en",
  content,
  style = DEFAULT_DUAL_IMAGE_TEXT_STYLE,
  extraImagePositions = [],
  cId,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.35, once: false });
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  const copy = (
    <DualImageTextContent
      items={content.items}
      firstSection={content.firstSection}
      showFirstSection={style.showFirstSection}
      links={content.links}
      extraImageUrl={content.extraImageUrl}
      extraImageAlt={content.extraImageAlt}
      extraImagePositions={extraImagePositions}
      exploreButtonLabel={content.exploreButtonLabel}
      exploreButtonHref={content.exploreButtonHref}
      cId={cId}
      style={style}
    />
  );

  return (
    <section
      ref={ref}
      className={`flex items-center justify-center ${paddingClass}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "100"),
            }
          : undefined
      }
    >
      <PageContentContainer>
        {style.animate ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
            transition={{ duration: 2, ease: "easeIn" }}
          >
            {copy}
          </motion.div>
        ) : (
          copy
        )}
      </PageContentContainer>
    </section>
  );
}
