import PageContentContainer from "@/components/layout/PageContentContainer";
import { DEFAULT_PHOTO_TILE_GRID_STYLE } from "../utils/style";
import PhotoTileGridCards from "./PhotoTileGridCards";
import PhotoTileGridHeader from "./PhotoTileGridHeader";

export default function PhotoTileGridPanel({
  lang = "en",
  content,
  style = DEFAULT_PHOTO_TILE_GRID_STYLE,
  cId,
}) {
  return (
    <div className="w-full">
      <PageContentContainer>
        <PhotoTileGridHeader
          lang={lang}
          title={content.title}
          style={style}
        />
        <PhotoTileGridCards
          lang={lang}
          destinations={content.destinations}
          cId={cId}
          style={style}
        />
      </PageContentContainer>
    </div>
  );
}
