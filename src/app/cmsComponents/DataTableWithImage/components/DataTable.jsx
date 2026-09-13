import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
  TABLE_RADIUS_CLASS,
} from "../utils/style";

export default function DataTable({
  headers = [],
  rows = [],
  isRtl = false,
  style = DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
}) {
  if (!rows.length) {
    return null;
  }

  const radiusClass =
    TABLE_RADIUS_CLASS[style.tableRadius] ?? TABLE_RADIUS_CLASS.sm;
  const tableBg = getThemeColorCss(style.tableBg, "white");
  const stripe = getThemeColorCss(style.stripeColor, "primary-2");
  const headerColor = getThemeColorCss(style.headerColor, "700");
  const cellColor = getThemeColorCss(style.cellColor, "700");

  return (
    <div
      className={`overflow-hidden border border-[#E6EBF0] ${radiusClass}`}
      style={{ backgroundColor: tableBg }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-center">
          {headers.length ? (
            <thead>
              <tr style={{ backgroundColor: tableBg }}>
                {headers.map((header, index) => (
                  <th
                    key={`${header || "header"}-${index}`}
                    className={`${typography.body} px-4 py-5 font-medium lg:px-6`}
                    style={{ color: headerColor }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                style={{
                  backgroundColor:
                    rowIndex % 2 === 0
                      ? `color-mix(in srgb, ${stripe} 20%, transparent)`
                      : tableBg,
                }}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`row-${rowIndex}-cell-${cellIndex}`}
                    className={`${typography.body} px-4 py-5 lg:px-6`}
                    dir={isRtl ? "rtl" : undefined}
                    style={{ color: cellColor }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
