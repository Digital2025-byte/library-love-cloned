import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_GRID_INFO_STYLE,
  TITLE_JUSTIFY_CLASS,
} from "../utils/style";

export default function GridInfoCityFilter({
  cities,
  selectedCity,
  onCityChange,
  style = DEFAULT_GRID_INFO_STYLE,
}) {
  if (!Array.isArray(cities) || cities.length <= 1) {
    return null;
  }

  const brandCss = getThemeColorCss(style.chipColor, "primary-1");
  const activeTextCss = getThemeColorCss(style.chipActiveText, "white");
  const idleBgCss = getThemeColorCss(style.chipIdleBg, "white");
  const alignKey =
    style.titleAlign in TITLE_JUSTIFY_CLASS ? style.titleAlign : "left";
  const justifyClass = TITLE_JUSTIFY_CLASS[alignKey];

  return (
    <div className={`mb-6 flex flex-wrap gap-3 ${justifyClass}`}>
      {cities.map((city) => {
        const isActive = selectedCity === city;

        return (
          <button
            key={city}
            type="button"
            onClick={() => onCityChange(city)}
            className={`${typography.button} rounded-lg border px-5 py-2 font-medium`}
            style={
              isActive
                ? {
                    backgroundColor: brandCss,
                    borderColor: brandCss,
                    color: activeTextCss,

                    fontWeight: getFontWeightValue(style.chipActiveTextFontWeight),
                  }
                : {
                    backgroundColor: idleBgCss,
                    borderColor: brandCss,
                    color: brandCss,
                  }
            }
          >
            <span>{city}</span>
          </button>
        );
      })}
    </div>
  );
}
