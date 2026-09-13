import { DRAWER_SIDES } from "../utils/constants";
import DrawerResizeHandle from "./DrawerResizeHandle";

export default function DrawerPanel({
  panelRef,
  isOpen,
  isDragging,
  side = "left",
  titleId,
  width,
  onResizePointerDown,
  children,
}) {
  const sideClasses = DRAWER_SIDES[side] ?? DRAWER_SIDES.left;

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-hidden={!isOpen}
      dir="ltr"
      lang="en"
      style={{ width }}
      className={[
        "pointer-events-auto fixed inset-y-0 z-50 flex max-w-full flex-col border-e border-200 bg-white lg:max-w-[50%]",
        sideClasses.position,
        isDragging ? "transition-none" : "transition-transform duration-300",
        isOpen ? "translate-x-0" : `pointer-events-none ${sideClasses.closed}`,
      ].join(" ")}
    >
      {children}
      <DrawerResizeHandle side={side} onPointerDown={onResizePointerDown} />
    </aside>
  );
}
