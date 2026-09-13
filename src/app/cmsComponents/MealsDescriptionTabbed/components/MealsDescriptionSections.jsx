import MealsDescriptionNotes from "./MealsDescriptionNotes";
import MealsDescriptionSection from "./MealsDescriptionSection";
import { DEFAULT_MEALS_TABBED_STYLE } from "../utils/style";

export default function MealsDescriptionSections({
  sections = [],
  notes = [],
  links = [],
  isSectionOpen,
  onToggleSection,
  panelId,
  labelledBy,
  wide = false,
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  if (!sections.length && !notes.length) {
    return null;
  }

  return (
    <div
      className={wide ? "lg:col-span-12" : "lg:col-span-8"}
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
    >
      {sections.map((section, sectionIndex) => (
        <MealsDescriptionSection
          key={`${section.sectionTitle || "section"}-${sectionIndex}`}
          section={section}
          sectionIndex={sectionIndex}
          isOpen={isSectionOpen?.(sectionIndex)}
          onToggle={() => onToggleSection?.(sectionIndex)}
          links={links}
          style={style}
        />
      ))}
      <MealsDescriptionNotes notes={notes} links={links} style={style} />
    </div>
  );
}
