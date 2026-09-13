import DestinationsMap from "../DestinationsMap";
import DestinationsMapContainer from "./DestinationsMapContainer";
import { resolveDestinationsMapStyle } from "../utils/style";

export default function DestinationsMapSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveDestinationsMapStyle(style);

  return (
    <DestinationsMapContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <DestinationsMap lang={lang} data={data} style={resolvedStyle} />
    </DestinationsMapContainer>
  );
}
