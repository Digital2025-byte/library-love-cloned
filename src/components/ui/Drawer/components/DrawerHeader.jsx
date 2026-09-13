import { XIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";

export default function DrawerHeader({ titleId, title, onClose }) {
  return (
    <div className="flex items-start gap-2 border-b border-200 bg-white px-4 py-2.5">
      <h2
        id={titleId}
        className={`min-w-0 flex-1 wrap-break-word pr-2 ${typography.caption} font-semibold tracking-wide text-main`}
      >
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="shrink-0 cursor-pointer rounded-md p-1 text-700 hover:bg-200 hover:text-main"
      >
        <XIcon size={20} weight="regular" aria-hidden />
      </button>
    </div>
  );
}
