import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import DataTable from "./DataTable";
import DataTableImage from "./DataTableImage";
import DataTableNote from "./DataTableNote";
import {
  DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function DataTableWithImagePanel({
  lang = "en",
  title = "",
  headers = [],
  rows = [],
  note = "",
  imageSrc = "",
  imageAlt = "",
  style = DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
}) {
  const isRtl = lang === "ar";
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className="w-full" dir={isRtl ? "rtl" : "ltr"}>
      {style.showTitle && title ? (
        <h2
          className={`${typography.sectionTitle} mb-4 font-semibold lg:mb-5 ${alignClass}`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          {style.showTable ? (
            <DataTable
              headers={headers}
              rows={rows}
              isRtl={isRtl}
              style={style}
            />
          ) : null}
          <DataTableNote note={note} style={style} />
        </div>

        {style.showImage ? (
          <div className="lg:col-span-5 hidden lg:block">
            <DataTableImage imageSrc={imageSrc} imageAlt={imageAlt} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
