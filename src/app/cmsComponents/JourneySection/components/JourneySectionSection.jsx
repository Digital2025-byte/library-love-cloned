import JourneySectionContainer from "./JourneySectionContainer";
import JourneySectionPanel from "./JourneySectionPanel";
import { getJourneySectionContent } from "../utils/helpers";
import { resolveJourneySectionStyle } from "../utils/style";

export default function JourneySectionSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveJourneySectionStyle(style);
  const content = getJourneySectionContent(data, lang);

  return (
    <JourneySectionContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <JourneySectionPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </JourneySectionContainer>
  );
}
