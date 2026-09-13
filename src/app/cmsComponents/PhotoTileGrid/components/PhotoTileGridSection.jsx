import PhotoTileGrid from "../PhotoTileGrid";
import PhotoTileGridContainer from "./PhotoTileGridContainer";
import { resolvePhotoTileGridStyle } from "../utils/style";

export default function PhotoTileGridSection({
  lang = "en",
  dir,
  data,
  style,
  cId,
  className = "",
}) {
  const resolvedStyle = resolvePhotoTileGridStyle(style);

  return (
    <PhotoTileGridContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <PhotoTileGrid lang={lang} data={data} style={resolvedStyle} cId={cId} />
    </PhotoTileGridContainer>
  );
}
