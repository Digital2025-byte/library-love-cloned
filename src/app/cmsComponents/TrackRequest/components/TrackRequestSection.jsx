import TrackRequestContainer from "./TrackRequestContainer";
import TrackRequestPanel from "./TrackRequestPanel";
import { getTrackRequestContent } from "../utils/helpers";
import { resolveTrackRequestStyle } from "../utils/style";

export default function TrackRequestSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveTrackRequestStyle(style);
  const content = getTrackRequestContent(data, lang);

  return (
    <TrackRequestContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <TrackRequestPanel content={content} style={resolvedStyle} />
      ) : null}
    </TrackRequestContainer>
  );
}
