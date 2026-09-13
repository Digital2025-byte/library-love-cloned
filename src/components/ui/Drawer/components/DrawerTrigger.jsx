import { SlidersHorizontal } from "@phosphor-icons/react";

const SIDE_CLASSES = {
  left: "left-0 rounded-e-lg border-s-0",
  right: "right-0 rounded-s-lg border-e-0",
};

export default function DrawerTrigger({
  triggerRef,
  onClick,
  onPointerDown,
  isOpen,
  side = "left",
  label = "Edit props",
}) {
  if (isOpen) return null;

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label={label}
      title={label}
      className={[
        "fixed top-1/2 z-[70] -translate-y-1/2 cursor-pointer touch-none border border-200 bg-50 p-2.5 text-main shadow-sm",
        "hover:bg-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1",
        SIDE_CLASSES[side] ?? SIDE_CLASSES.left,
      ].join(" ")}
    >
      <SlidersHorizontal size={20} weight="regular" aria-hidden />
    </button>
  );
}
