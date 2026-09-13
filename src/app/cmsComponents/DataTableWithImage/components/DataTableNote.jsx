import { InfoIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE } from "../utils/style";

export default function DataTableNote({
  note = "",
  style = DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
}) {
  if (!style.showDescription || !note) {
    return null;
  }

  const color = getThemeColorCss(style.descriptionColor, "primary-1");

  return (
    <p
      className={`${typography.caption} mt-5 flex items-center gap-2`}
      style={{ color }}
    >
      <InfoIcon
        size={18}
        weight="fill"
        className="shrink-0"
        style={{ color }}
        aria-hidden
      />
      <span>{note}</span>
    </p>
  );
}
