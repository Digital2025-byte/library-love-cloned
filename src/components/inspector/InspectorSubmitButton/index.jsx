import { typography } from "@/styles/typography";

export default function InspectorSubmitButton({
  onClick,
  children = "Submit",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${typography.button} w-full cursor-pointer rounded-sm border border-main bg-main px-4 py-2.5 font-medium text-50 hover:bg-main-light`}
    >
      {children}
    </button>
  );
}
