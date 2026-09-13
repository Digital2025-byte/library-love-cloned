import { InfoIcon } from "@phosphor-icons/react";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_MEALS_TABBED_STYLE } from "../utils/style";

export default function MealsDescriptionNotes({
  notes = [],
  links = [],
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  if (!notes.length) {
    return null;
  }

  const colorCss = getThemeColorCss(style.notesColor, "primary-1");
  const showLinks = style.showLinks !== false;

  return (
    <aside
      className="mt-4 flex items-start gap-3 rounded-lg px-4 py-3"
      aria-label="Meal notes"
      style={{ color: colorCss }}
    >
      <InfoIcon
        size={25}
        weight="fill"
        className="mt-0.5 shrink-0"
        aria-hidden
      />
      <ul className={`${typography.caption} list-disc space-y-1 ps-4`}>
        {notes.map((note, index) => {
          const text = typeof note === "string" ? note : note?.text || "";
          return (
            <li key={`${String(text).slice(0, 24)}-${index}`}>
              <LinkedText
                text={text}
                links={links}
                style={style}
                enabled={showLinks}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
