import { PhoneIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_CALL_US_STYLE } from "../utils/style";

export default function CallUsIcon({ style = DEFAULT_CALL_US_STYLE }) {
  const iconBg = getThemeColorCss(style.iconBg, "primary-1");

  return (
    <div
      className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
      style={{
        backgroundColor: `color-mix(in srgb, ${iconBg} 90%, transparent)`,
      }}
    >
      <PhoneIcon
        size={26}
        weight="regular"
        className="rtl:-scale-x-100"
        style={{ color: getThemeColorCss(style.iconColor, "white") }}
      />
    </div>
  );
}
