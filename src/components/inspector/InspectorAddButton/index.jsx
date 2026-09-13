import { PlusIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { inspectorIconHoverClass } from "../constants";

export default function InspectorAddButton({ onClick, children = "Add Item" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${typography.caption} group inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-200 bg-50 py-2 font-medium text-700 hover:bg-100 hover:text-main`}
    >
      <PlusIcon
        size={14}
        weight="bold"
        aria-hidden
        className={inspectorIconHoverClass}
      />
      {children}
    </button>
  );
}
