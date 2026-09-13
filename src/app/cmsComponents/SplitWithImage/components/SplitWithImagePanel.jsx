"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_SPLIT_WITH_IMAGE_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function SplitWithImagePanel({
  lang = "en",
  content,
  style = DEFAULT_SPLIT_WITH_IMAGE_STYLE,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });
  const imagesOnRight = style.imageSide !== "left";
  const textOrder = imagesOnRight ? "order-2 lg:order-1" : "order-2 lg:order-2";
  const imageOrder = imagesOnRight ? "order-1 lg:order-2" : "order-1 lg:order-1";
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const backgroundUrl = style.showBackgroundImage
    ? content.backgroundImageUrl
    : "";
  const overlayColor = style.showSectionBg
    ? getThemeColorCss(style.sectionBg, "100")
    : undefined;

  return (
    <div ref={ref} dir={lang === "ar" ? "rtl" : "ltr"}>
      <CustomBackgroundImage
        imageUrl={isUsableImageSrc(backgroundUrl) ? backgroundUrl : ""}
        className="min-h-screen"
        initialAnimation={{ scale: 1 }}
        animateAnimation={isInView ? { scale: 1.3 } : { scale: 1 }}
        transition={{ duration: 7, ease: "easeInOut" }}
        overlayColor={overlayColor}
        desktopGradient={Boolean(overlayColor)}
        lang={lang}
        imageFit={style.imageFit}
        imagePosition={style.imagePosition}
      >
        <section className="flex min-h-screen items-center justify-center">
          <PageContentContainer
            className={`grid grid-cols-1 gap-0 lg:grid-cols-2 ${paddingClass}`}
          >
            <div className={`${textOrder} -mt-14 py-4 ${alignClass}`}>
              {style.showTitle && content.title ? (
                <h2
                  className={`${typography.pageTitle} mb-4 font-bold wrap-break-word`}
                  style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight),
                  }}
                >
                  {content.title}
                </h2>
              ) : null}
              {style.showDescription && content.description ? (
                <motion.p
                  className={`${typography.sectionDescription} text-start font-medium leading-9 wrap-break-word`}
                  style={{
                    color: getThemeColorCss(
                      style.descriptionColor,
                      "secondary-2"
                    ),
                    fontWeight: getFontWeightValue(style.descriptionFontWeight),
                  }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <LinkedText
                    text={content.description}
                    links={content.links}
                    style={style}
                    enabled={style.showLinks !== false}
                  />
                </motion.p>
              ) : null}
            </div>

            <motion.div
              className={`${imageOrder} p-4 py-0`}
              initial={{ x: -45, y: -40 }}
              animate={
                isInView ? { x: -5, y: -55 } : { x: -45, y: -40 }
              }
              transition={{ delay: 1.5, duration: 5, ease: "easeIn" }}
            >
              {style.showImage && isUsableImageSrc(content.imageUrl) ? (
                <Image
                  src={content.imageUrl}
                  alt={content.imageAlt || ""}
                  width={1000}
                  height={1000}
                  className="h-full w-full scale-110 object-contain"
                  priority
                />
              ) : null}
            </motion.div>
          </PageContentContainer>
        </section>
      </CustomBackgroundImage>
    </div>
  );
}
