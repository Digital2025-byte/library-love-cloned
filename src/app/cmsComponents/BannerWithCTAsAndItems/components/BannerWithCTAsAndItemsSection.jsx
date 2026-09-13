import BannerWithCTAsAndItemsContainer from "./BannerWithCTAsAndItemsContainer";
import BannerWithCTAsAndItemsPanel from "./BannerWithCTAsAndItemsPanel";
import { getBannerWithCTAsAndItemsContent } from "../utils/helpers";
import { resolveBannerWithCTAsStyle } from "../utils/style";

export default function BannerWithCTAsAndItemsSection({
  lang = "en",
  dir,
  data,
  style,
  posParams,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveBannerWithCTAsStyle(style);
  const content = getBannerWithCTAsAndItemsContent(data, lang, posParams, cId);

  return (
    <BannerWithCTAsAndItemsContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      {content.hasContent ? (
        <BannerWithCTAsAndItemsPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </BannerWithCTAsAndItemsContainer>
  );
}
