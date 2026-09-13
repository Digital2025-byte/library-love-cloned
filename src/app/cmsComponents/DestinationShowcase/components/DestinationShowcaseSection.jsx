import DestinationShowcaseContainer from "./DestinationShowcaseContainer";
import DestinationShowcasePanel from "./DestinationShowcasePanel";
import { getDestinationShowcaseContent } from "../utils/helpers";
import { resolveDestinationShowcaseStyle } from "../utils/style";

export default function DestinationShowcaseSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveDestinationShowcaseStyle(style);
  const content = getDestinationShowcaseContent(data, lang, { posParams, cId });

  return (
    <DestinationShowcaseContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <DestinationShowcasePanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </DestinationShowcaseContainer>
  );
}
