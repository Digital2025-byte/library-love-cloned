"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { isUsableImageSrc } from "../utils/helpers";
import { DEFAULT_FULL_HEIGHT_HEADER_STYLE } from "../utils/style";
import FullHeightHeaderWithTextContent from "./FullHeightHeaderWithTextContent";

export default function FullHeightHeaderWithTextPanel({
  lang = "en",
  content,
  style = DEFAULT_FULL_HEIGHT_HEADER_STYLE,
  cId,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4, once: false });
  const isRtl = lang === "ar";
  const heroSrc =
    style.showHeroImage && isUsableImageSrc(content.backgroundImage)
      ? content.backgroundImage
      : "";
  const overlayCss = style.showOverlay
    ? getThemeColorCss(style.overlayColor, "main")
    : undefined;
  const isCenter = style.titleAlign === "center";

  return (
    <div
      ref={ref}
      className="relative h-dvh min-h-dvh w-full"
      dir={isRtl ? "rtl" : "ltr"}
      style={
        heroSrc
          ? undefined
          : { backgroundColor: getThemeColorCss(style.overlayColor, "main") }
      }
    >
      <CustomBackgroundImage
        imageUrl={heroSrc}
        className="h-full min-h-dvh"
        initialAnimation={{ scale: 1 }}
        animateAnimation={{ scale: 1.12 }}
        transition={{ duration: 5, ease: "easeInOut" }}
        mobileGradient={style.showOverlay}
        desktopGradient={style.showOverlay}
        overlayColor={overlayCss}
        lang={lang}
        imageFit={style.imageFit}
        imagePosition={style.imagePosition}
      >
        <section
          className="flex h-full min-h-dvh items-end justify-center py-16 sm:py-20 lg:items-center lg:py-24"
          aria-label={content.imageAlt || content.title || undefined}
        >
          <PageContentContainer className="w-full">
            <motion.div
              className={
                isCenter
                  ? "flex w-full justify-center"
                  : "grid w-full grid-cols-1 gap-8 lg:grid-cols-2"
              }
              initial={{ opacity: 0, y: 64 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 64 }
              }
              transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
            >
              <FullHeightHeaderWithTextContent
                lang={lang}
                content={content}
                style={style}
                cId={cId}
              />
            </motion.div>
          </PageContentContainer>
        </section>
      </CustomBackgroundImage>
    </div>
  );
}
