import { typography } from "@/styles/typography";
import { ALERT_THEMES } from "../utils/constants";

export default function LegalAlert({
  message = "",
  variant = "secondary",
  className = "",
}) {
  if (!message) {
    return null;
  }

  const theme = ALERT_THEMES[variant] || ALERT_THEMES.info;

  return (
    <div
      className={`relative overflow-hidden rounded-[10px] border border-200 ${theme.bg} ${theme.fg} ${className}`}
    >
      <div className={`absolute inset-y-0 start-0 w-[5px] ${theme.bar}`} />
      <div className="px-4 py-4 ps-5">
        <p className={`${typography.body} leading-snug`}>{message}</p>
      </div>
    </div>
  );
}
