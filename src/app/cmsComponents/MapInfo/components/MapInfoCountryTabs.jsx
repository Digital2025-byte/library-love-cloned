import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_MAP_INFO_STYLE } from "../utils/style";

export default function MapInfoCountryTabs({
  countries,
  selectedCountry,
  onCountryChange,
  style = DEFAULT_MAP_INFO_STYLE,
}) {
  if (!Array.isArray(countries) || countries.length === 0) {
    return null;
  }

  const brandCss = getThemeColorCss(style.chipColor, "primary-1");
  const activeTextCss = getThemeColorCss(style.chipActiveText, "white");
  const idleBgCss = getThemeColorCss(style.chipIdleBg, "white");

  return (
    <div className="mb-6 flex flex-wrap gap-3 px-2">
      {countries.map((country) => {
        const isActive = selectedCountry === country;

        return (
          <button
            key={country}
            type="button"
            onClick={() => onCountryChange(country)}
            className={`${typography.button} cursor-pointer rounded-lg px-5 py-2 font-medium transition-all`}
            style={
              isActive
                ? {
                    backgroundColor: brandCss,
                    border: `1px solid ${brandCss}`,
                    color: activeTextCss,

                    fontWeight: getFontWeightValue(style.chipActiveTextFontWeight),
                  }
                : {
                    backgroundColor: idleBgCss,
                    border: `1px solid ${brandCss}`,
                    color: brandCss,
                  }
            }
          >
            {country}
          </button>
        );
      })}
    </div>
  );
}
