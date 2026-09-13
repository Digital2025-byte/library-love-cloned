import TabbedCardsContainer from "./TabbedCardsContainer";
import TabbedCardsPanel from "./TabbedCardsPanel";
import { getTabbedCardsContent } from "../utils/helpers";
import { resolveTabbedCardsStyle } from "../utils/style";

export default function TabbedCardsSectionSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveTabbedCardsStyle(style);
  const content = getTabbedCardsContent(data, lang);

  return (
    <TabbedCardsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <TabbedCardsPanel lang={lang} content={content} style={resolvedStyle} />
      ) : null}
    </TabbedCardsContainer>
  );
}
