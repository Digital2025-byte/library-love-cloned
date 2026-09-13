import DestinationsCitiesContainer from "./DestinationsCitiesContainer";
import DestinationsCitiesPanel from "./DestinationsCitiesPanel";
import { getDestinationsCitiesContent } from "../utils/helpers";
import { resolveDestinationsCitiesStyle } from "../utils/style";

export default function DestinationsCitiesSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  className = "",
}) {
  const resolvedStyle = resolveDestinationsCitiesStyle(style);
  const content = getDestinationsCitiesContent(data, lang);

  return (
    <DestinationsCitiesContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <DestinationsCitiesPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          posParams={posParams}
        />
      ) : null}
    </DestinationsCitiesContainer>
  );
}
