"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import maskImg from "@/assets/maskImg.png";
import { isUsableImageSrc } from "../utils/helpers";

const maskUrl = typeof maskImg === "string" ? maskImg : maskImg.src;

export default function VerticalImageSliceImage({ imageSrc, imageAlt }) {
  if (!isUsableImageSrc(imageSrc)) {
    return (
      <div
        className="relative flex min-h-50 w-full items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-sm text-gray-400 lg:min-h-100"
        aria-hidden
      />
    );
  }

  const usableMask = isUsableImageSrc(maskUrl) ? maskUrl : "";
  const maskStyle = usableMask
    ? {
        maskImage: `url(${usableMask})`,
        WebkitMaskImage: `url(${usableMask})`,
        maskMode: "luminance",
        WebkitMaskSourceType: "luminance",
        maskSize: "auto 78%",
        WebkitMaskSize: "auto 78%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center calc(50% + var(--mask-y) * 1px)",
        WebkitMaskPosition: "center calc(50% + var(--mask-y) * 1px)",
      }
    : {};

  return (
    <div className="relative z-0 mx-auto h-90 w-full max-w-md overflow-hidden sm:h-100 lg:h-125 lg:max-w-none">
      <motion.div
        className="absolute inset-[8%]"
        style={{ ...maskStyle, "--mask-y": -12 }}
        animate={{ "--mask-y": [-12, 12, -12] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt || "Travel experience"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  );
}
