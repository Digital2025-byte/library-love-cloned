import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_SEARCH_GRID_STYLE } from "../utils/style";

export default function SearchFields({
  placeholder = "",
  searchQuery = "",
  onSearchQueryChange,
  style = DEFAULT_SEARCH_GRID_STYLE,
}) {
  const fillCss = getThemeColorCss(style.searchBg, "white");
  const textCss = getThemeColorCss(style.searchText, "white");

  return (
    <div className="w-full">
      <input
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder={placeholder}
        className={`${typography.body} w-full rounded-xl border px-5 py-3 focus:outline-none`}
        style={{
          backgroundColor: `color-mix(in srgb, ${fillCss} 10%, transparent)`,
          borderColor: `color-mix(in srgb, ${fillCss} 20%, transparent)`,
          color: textCss,
          "--tw-ring-color": `color-mix(in srgb, ${fillCss} 40%, transparent)`,
        }}
        aria-label={placeholder}
      />
    </div>
  );
}
