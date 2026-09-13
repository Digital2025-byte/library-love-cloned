import { getThemeColorCss } from "@/styles/themeColors";
import OfficeItem from "./OfficeItem";
import { DEFAULT_OFFICE_DIRECTORY_STYLE } from "../utils/style";

export default function OfficeList({
  offices = [],
  labels,
  style = DEFAULT_OFFICE_DIRECTORY_STYLE,
}) {
  const lineCss = getThemeColorCss(style.lineColor, "secondary-700");

  return (
    <div className="relative">
      {style.showDashedLine && style.showPin ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 bottom-6 start-0 z-0 flex w-9 justify-center md:top-8 md:bottom-8 md:w-11"
        >
          <span
            className="block h-full w-0.5"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${lineCss} 0 6px, transparent 6px 12px)`,
            }}
          />
        </span>
      ) : null}

      {offices.map((office, index) => (
        <OfficeItem
          key={`${office.name}-${index}`}
          office={office}
          labels={labels}
          isLast={index === offices.length - 1}
          style={style}
        />
      ))}
    </div>
  );
}
