import Image from "next/image";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { isUsableImageSrc } from "../utils/helpers";
import styles from "../ImageCarouselsWithOppositeScrollDirections.module.css";

export default function DestinationImageCard({ item, w, h, style }) {
  if (!item) {
    return null;
  }

  const src = item.fileUrl;
  const canRenderImage = isUsableImageSrc(src);

  return (
    <div className={styles.card} style={{ "--w": `${w}px`, "--h": `${h}px` }}>
      {canRenderImage ? (
        <Image
          src={src}
          alt={item.alt || item.title || "Destination image"}
          fill
          className={styles.image}
          sizes={`${w}px`}
          quality={75}
        />
      ) : (
        <div className="absolute inset-0 bg-primary-700" aria-hidden />
      )}

      {style.showOverlay ? <div className={styles.overlay} /> : null}
      <div className={styles.cardDim} aria-hidden />

      {style.showCardTitles && item.title ? (
        <div className={styles.titleWrap}>
          <p
            className={`${typography.itemTitle} font-semibold`}
            style={{ color: getThemeColorCss(style.cardTitleColor, "white"), fontWeight: getFontWeightValue(style.cardTitleFontWeight) }}
          >
            {item.title}
          </p>
        </div>
      ) : null}
    </div>
  );
}
