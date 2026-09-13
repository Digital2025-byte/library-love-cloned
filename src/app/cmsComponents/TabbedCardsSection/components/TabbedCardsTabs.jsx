import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_TABBED_CARDS_STYLE } from "../utils/style";

export default function TabbedCardsTabs({
  tabs,
  activeTabIndex,
  onTabChange,
  style = DEFAULT_TABBED_CARDS_STYLE,
}) {
  const visibleTabs = tabs.filter((tab) => tab?.label);

  if (!visibleTabs.length) {
    return null;
  }

  const trackCss = getThemeColorCss(style.tabTrack, "200");
  const activeBgCss = getThemeColorCss(style.tabActiveBg, "primary-1");
  const activeTextCss = getThemeColorCss(style.tabActiveText, "white");
  const idleTextCss = getThemeColorCss(style.tabIdleText, "primary-1");

  return (
    <div className="mb-6 flex justify-center">
      <div
        role="tablist"
        className="cursor-pointer grid rounded-lg px-3 py-1.5"
        style={{
          gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(7.5rem, 1fr))`,
          backgroundColor: `color-mix(in srgb, ${trackCss} 50%, transparent)`,
        }}
      >
        {tabs.map((tab, index) =>
          tab?.label ? (
            <button
              key={`${tab.label}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeTabIndex === index}
              onClick={() => onTabChange(index)}
              className={`${typography.button} cursor-pointer rounded-lg px-10 py-2 text-center font-semibold whitespace-nowrap transition-colors`}
              style={
                activeTabIndex === index
                  ? {
                      backgroundColor: activeBgCss,
                      color: activeTextCss,
                    }
                  : {
                      backgroundColor: "transparent",
                      color: idleTextCss,
                    }
              }
            >
              {tab.label}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}
