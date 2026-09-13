import ContactCardsContainer from "./ContactCardsContainer";
import ContactCardsPanel from "./ContactCardsPanel";
import { getContactCardsContent } from "../utils/helpers";
import { resolveContactCardsStyle } from "../utils/style";

export default function ContactCardsSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveContactCardsStyle(style);
  const content = getContactCardsContent(data, lang);

  return (
    <ContactCardsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <ContactCardsPanel content={content} style={resolvedStyle} />
      ) : null}
    </ContactCardsContainer>
  );
}
