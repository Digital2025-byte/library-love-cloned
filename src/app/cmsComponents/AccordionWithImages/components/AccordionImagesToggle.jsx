import { getThemeColorCss } from "@/styles/themeColors";

export default function AccordionImagesToggle({
  isOpen,
  onToggle,
  background = "primary-1",
  border = "secondary-1",
  icon = "white",
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-opacity duration-300 hover:opacity-90 sm:h-10 sm:w-10"
      style={{
        backgroundColor: getThemeColorCss(background, "primary-1"),
        borderColor: getThemeColorCss(border, "secondary-1"),
        color: getThemeColorCss(icon, "white"),
      }}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <span className="text-xl leading-none sm:text-2xl">+</span>
    </button>
  );
}
