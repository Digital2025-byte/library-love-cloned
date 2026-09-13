import Link from "next/link";
import { typography } from "@/styles/typography";
import { withCampaignPath } from "@/utils/withCampaignPath";
import styles from "../ImageCarouselsWithOppositeScrollDirections.module.css";

export default function ExploreOverlay({ label, href, cId }) {
  if (!label || !href) {
    return null;
  }

  return (
    <div className={styles.hoverOverlay}>
      <Link href={withCampaignPath(href, cId)}>
        <button type="button" className={`${styles.exploreButton} ${typography.button}`}>
          {label}
        </button>
      </Link>
    </div>
  );
}
