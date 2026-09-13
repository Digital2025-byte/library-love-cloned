import { DotsSixVertical } from "@phosphor-icons/react";
import { DRAWER_SIDES } from "../utils/constants";

export default function DrawerResizeHandle({ side = "left", onPointerDown }) {
  const sideClasses = DRAWER_SIDES[side] ?? DRAWER_SIDES.left;

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize drawer"
      onPointerDown={onPointerDown}
      className={[
        "absolute inset-y-0 z-10 flex w-4 touch-none items-center justify-center text-500",
        sideClasses.handle,
      ].join(" ")}
    >
      <DotsSixVertical size={16} weight="bold" aria-hidden />
    </div>
  );
}
