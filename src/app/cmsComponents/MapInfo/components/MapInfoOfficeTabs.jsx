import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_MAP_INFO_STYLE } from "../utils/style";

export default function MapInfoOfficeTabs({
  offices,
  selectedOfficeIndex,
  onOfficeChange,
  style = DEFAULT_MAP_INFO_STYLE,
}) {
  if (!Array.isArray(offices) || offices.length <= 1) {
    return null;
  }

  const tabCss = getThemeColorCss(style.tabColor, "primary-1");

  return (
    <div className="mx-auto mb-6 max-w-7xl px-2">
      <div className="-mb-px border-b border-gray-200">
        <div className="flex flex-wrap gap-6">
          {offices.map((office, index) => {
            const isActive = selectedOfficeIndex === index;
            const label =
              office.name || `${office.city} - Branch ${index + 1}`;

            return (
              <button
                key={`${office.id || office.name || index}-${index}`}
                type="button"
                onClick={() => onOfficeChange(index)}
                className="cursor-pointer py-2 text-xs font-medium transition-colors md:text-sm"
                style={
                  isActive
                    ? {
                        borderBottom: `2px solid ${tabCss}`,
                        color: tabCss,

                        fontWeight: getFontWeightValue(style.tabFontWeight),
                      }
                    : {
                        borderBottom: "2px solid transparent",
                        color: "var(--color-500)",
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
