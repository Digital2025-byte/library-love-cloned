import MealsDescriptionTabbedContainer from "./MealsDescriptionTabbedContainer";
import MealsDescriptionTabbedPanel from "./MealsDescriptionTabbedPanel";
import { getMealsDescriptionTabbedContent } from "../utils/helpers";
import { resolveMealsTabbedStyle } from "../utils/style";

export default function MealsDescriptionTabbedSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveMealsTabbedStyle(style);
  const content = getMealsDescriptionTabbedContent(data, lang);

  return (
    <MealsDescriptionTabbedContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      {content.hasContent ? (
        <MealsDescriptionTabbedPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </MealsDescriptionTabbedContainer>
  );
}
