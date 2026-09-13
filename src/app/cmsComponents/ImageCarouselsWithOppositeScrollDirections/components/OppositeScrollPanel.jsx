import ExploreOverlay from "./ExploreOverlay";
import MarqueeRow from "./MarqueeRow";
import OppositeScrollHeader from "./OppositeScrollHeader";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  CARD_GAP_VALUE,
  CARD_RADIUS_VALUE,
  ROW_GAP_CLASS,
  SECTION_PADDING_CLASS,
} from "../utils/style";
import styles from "../ImageCarouselsWithOppositeScrollDirections.module.css";

export default function OppositeScrollPanel({ content, style, cId }) {
  const {
    title,
    description,
    links = [],
    exploreLabel,
    exploreHref,
    topRow,
    bottomRow,
  } = content;
  const duration = Number(style.speed) || 15;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const gapClass = ROW_GAP_CLASS[style.rowGap] ?? ROW_GAP_CLASS.default;
  const topDirection = style.reverseRows ? "left" : "right";
  const bottomDirection = style.reverseRows ? "right" : "left";

  return (
    <section
      className={styles.sectionContainer}
      style={{
        backgroundColor: style.showSectionBg
          ? getThemeColorCss(style.sectionBg, "primary-800")
          : "transparent",
        "--card-radius":
          CARD_RADIUS_VALUE[style.cardRadius] ?? CARD_RADIUS_VALUE.lg,
        "--card-gap": CARD_GAP_VALUE[style.cardGap] ?? CARD_GAP_VALUE.default,
        "--card-overlay": getThemeColorCss(style.overlayColor, "foreground"),
        "--explore-bg": getThemeColorCss(style.buttonBg, "white"),
        "--explore-fg": getThemeColorCss(style.buttonColor, "white"),
      }}
    >
      <div className={paddingClass}>
        <OppositeScrollHeader
          title={title}
          description={description}
          links={links}
          style={style}
        />

        <div
          className={[
            "flex flex-col",
            gapClass,
            styles.carouselContainer,
            style.dimOnHover ? styles.dimOnHover : "",
            style.pauseOnHover ? styles.pauseOnHover : "",
            style.showExploreButton ? styles.showExplore : "",
          ]
            .filter(Boolean)
            .join(" ")}
          dir="ltr"
        >
          <MarqueeRow
            items={topRow}
            direction={topDirection}
            duration={duration}
            style={style}
          />
          <MarqueeRow
            items={bottomRow}
            direction={bottomDirection}
            duration={duration}
            style={style}
          />
          {style.showExploreButton ? (
            <ExploreOverlay label={exploreLabel} href={exploreHref} cId={cId} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
