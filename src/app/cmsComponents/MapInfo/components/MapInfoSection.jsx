import MapInfo from "../MapInfo";
import MapInfoContainer from "./MapInfoContainer";
import { resolveMapInfoStyle } from "../utils/style";

export default function MapInfoSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveMapInfoStyle(style);

  return (
    <MapInfoContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <MapInfo lang={lang} data={data} style={resolvedStyle} />
    </MapInfoContainer>
  );
}
