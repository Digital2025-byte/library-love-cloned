"use client";

import { motion } from "framer-motion";

export default function CarouselCardShell({
  isActive,
  hidden,
  safeZIndex,
  onSelect,
  onDragEnd,
  isEntering,
  isLeaving,
  direction,
  baseTransform,
  radiusClass = "rounded-3xl",
  children,
}) {
  return (
    <motion.div
      className={`absolute inset-0 cursor-grab overflow-hidden ${radiusClass} ${
        isActive ? "" : "blur-[1px]"
      }`}
      style={{
        zIndex: safeZIndex,
        pointerEvents: hidden ? "none" : "auto",
      }}
      drag={isActive ? "x" : false}
      dragConstraints={isActive ? { left: 0, right: 0 } : undefined}
      dragElastic={0.2}
      onDragEnd={isActive ? onDragEnd : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={hidden ? -1 : 0}
      aria-pressed={isActive}
      aria-hidden={hidden}
      initial={
        isEntering && direction === -1
          ? {
              x: "120%",
              y: 0,
              scale: 0.98,
              opacity: 0,
              rotateZ: 4,
            }
          : false
      }
      animate={
        hidden
          ? {
              ...baseTransform,
              opacity: 0,
            }
          : isLeaving && direction === 1
            ? {
                x: "120%",
                y: 0,
                scale: 0.98,
                opacity: 0,
                rotateZ: 4,
              }
            : baseTransform
      }
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}
