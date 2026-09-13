import HelpCategoriesContainer from "./HelpCategoriesContainer";
import HelpCategoriesPanel from "./HelpCategoriesPanel";
import { getHelpCategoriesContent } from "../utils/helpers";
import { resolveHelpCategoriesStyle } from "../utils/style";

export default function HelpCategoriesSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveHelpCategoriesStyle(style);
  const content = getHelpCategoriesContent(data, lang);

  return (
    <HelpCategoriesContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <HelpCategoriesPanel lang={lang} content={content} style={resolvedStyle} />
      ) : null}
    </HelpCategoriesContainer>
  );
}
