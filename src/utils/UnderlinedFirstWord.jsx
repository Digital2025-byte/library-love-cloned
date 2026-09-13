import { typography } from "@/styles/typography";

/**
 * Renders text with the first word underlined.
 */
export function UnderlinedFirstWord({ text = "", underline = true }) {
  const safeText = String(text || "");
  const firstSpaceIndex = safeText.indexOf(" ");

  const firstWord =
    firstSpaceIndex === -1 ? safeText : safeText.substring(0, firstSpaceIndex);
  const remainingText =
    firstSpaceIndex === -1 ? "" : safeText.substring(firstSpaceIndex);

  return (
    <h2 className={`${typography.sectionTitle} font-semibold text-primary-1`}>
      <span className="relative inline-block">
        {firstWord}
        {underline && firstWord ? (
          <span className="absolute -bottom-1.5 start-0 h-0.5 w-full bg-primary-2 sm:-bottom-2" />
        ) : null}
      </span>
      {remainingText}
    </h2>
  );
}
