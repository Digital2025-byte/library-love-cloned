import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_SEARCH_GRID_STYLE } from "../utils/style";

export default function SearchPagination({
  pageCount = 0,
  activePageIndex = 0,
  onPrev,
  onNext,
  onGoToPage,
  style = DEFAULT_SEARCH_GRID_STYLE,
}) {
  if (pageCount <= 1 || (!style.showArrows && !style.showDots)) {
    return null;
  }

  const arrowCss = getThemeColorCss(style.navColor, "white");
  const dotCss = getThemeColorCss(style.dotColor, "primary-2");

  return (
    <div
      className="z-10 mt-5 flex items-center justify-center gap-6"
      dir="ltr"
      role="navigation"
      aria-label="Results pagination"
    >
      {style.showArrows ? (
        <button
          type="button"
          onClick={onPrev}
          disabled={activePageIndex === 0}
          aria-label="Previous page"
          className="cursor-pointer rounded-full border-2 p-2 transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: arrowCss }}
        >
          <ArrowLeftIcon size={18} weight="bold" style={{ color: arrowCss }} />
        </button>
      ) : null}

      {style.showDots ? (
        <div className="flex gap-2">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={`page-dot-${index}`}
              type="button"
              onClick={() => onGoToPage(index)}
              aria-label={`Go to page ${index + 1}`}
              aria-current={index === activePageIndex ? "page" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activePageIndex ? "w-5" : "w-2 opacity-40"
              }`}
              style={{ backgroundColor: dotCss }}
            />
          ))}
        </div>
      ) : null}

      {style.showArrows ? (
        <button
          type="button"
          onClick={onNext}
          disabled={activePageIndex === pageCount - 1}
          aria-label="Next page"
          className="cursor-pointer rounded-full border-2 p-2 transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: arrowCss }}
        >
          <ArrowRightIcon size={18} weight="bold" style={{ color: arrowCss }} />
        </button>
      ) : null}
    </div>
  );
}
