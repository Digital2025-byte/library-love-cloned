"use client";

import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";
import {
  IMAGE_FIT_CSS,
  IMAGE_POSITION_CSS,
} from "@/app/cmsComponents/shared/backgroundImage";

function toCssUrl(url = "") {
  return String(url)
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

export default function CustomBackgroundImage({
  imageUrl,
  mobileImageUrl,
  className = "",
  style,
  children,
  initialAnimation = { scale: 1 },
  animateAnimation = { scale: 1 },
  transition = { duration: 5, ease: "easeInOut" },
  desktopGradient = false,
  mobileGradient = false,
  overlayColor,
  lang = "en",
  flipImage = false,
  specialGradient = false,
  imageFit = "cover",
  imagePosition = "center",
}) {
  const isMobile = useIsMobile(768);

  const bgSrc =
    isMobile && (mobileImageUrl?.src || mobileImageUrl)
      ? mobileImageUrl?.src || mobileImageUrl
      : imageUrl?.src || imageUrl;

  const safeBgSrc = typeof bgSrc === "string" ? toCssUrl(bgSrc) : bgSrc;
  const backgroundSize = IMAGE_FIT_CSS[imageFit] ?? IMAGE_FIT_CSS.cover;
  const backgroundPosition =
    IMAGE_POSITION_CSS[imagePosition] ?? IMAGE_POSITION_CSS.center;

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className={`absolute inset-0 h-full w-full bg-no-repeat ${
            flipImage ? "scale-x-[-1]" : ""
          }`}
          style={{
            backgroundImage: safeBgSrc ? `url(${safeBgSrc})` : undefined,
            backgroundSize: safeBgSrc ? backgroundSize : undefined,
            backgroundPosition: safeBgSrc ? backgroundPosition : undefined,
          }}
          initial={initialAnimation}
          animate={animateAnimation}
          transition={transition}
        />

        {desktopGradient ? (
          <div
            className={`absolute inset-y-0 w-full lg:w-3/4 ${
              mobileGradient ? "hidden lg:block" : ""
            } ${
              overlayColor
                ? lang === "ar"
                  ? "right-0"
                  : "left-0"
                : lang === "ar"
                  ? "right-0 bg-gradient-to-l from-main/50 to-transparent"
                  : "left-0 bg-gradient-to-r from-main/50 to-transparent"
            }`}
            style={
              overlayColor
                ? {
                    backgroundImage:
                      lang === "ar"
                        ? `linear-gradient(to left, color-mix(in srgb, ${overlayColor} 50%, transparent), transparent)`
                        : `linear-gradient(to right, color-mix(in srgb, ${overlayColor} 50%, transparent), transparent)`,
                  }
                : undefined
            }
            aria-hidden
          />
        ) : null}

        {mobileGradient ? (
          <div
            className={
              overlayColor
                ? "absolute inset-x-0 bottom-0 h-1/2 lg:hidden"
                : "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-main/50 to-transparent lg:hidden"
            }
            style={
              overlayColor
                ? {
                    backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${overlayColor} 50%, transparent), transparent)`,
                  }
                : undefined
            }
            aria-hidden
          />
        ) : null}

        {specialGradient ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: overlayColor
                ? `linear-gradient(180deg, color-mix(in srgb, ${overlayColor} 20%, transparent) 0%, color-mix(in srgb, ${overlayColor} 72%, transparent) 100%)`
                : "linear-gradient(180deg, rgb(5 78 114 / 0.2) 0%, rgb(19 54 75 / 0.72) 100%)",
            }}
            aria-hidden
          />
        ) : null}
      </div>

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
