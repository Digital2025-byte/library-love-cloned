import facebook from "@/assets/SimpleGridWithPrefix/facebook.png";
import instagram from "@/assets/SimpleGridWithPrefix/instagram.png";
import linkedin from "@/assets/SimpleGridWithPrefix/linkedin.png";
import pinterest from "@/assets/SimpleGridWithPrefix/pinterest.png";
import snapchat from "@/assets/SimpleGridWithPrefix/snapchat.png";
import telegram from "@/assets/SimpleGridWithPrefix/telegram.png";
import tikTok from "@/assets/SimpleGridWithPrefix/tik_tok.png";
import twitter from "@/assets/SimpleGridWithPrefix/twitter.png";
import whatsapp from "@/assets/SimpleGridWithPrefix/whatsapp.png";
import x from "@/assets/SimpleGridWithPrefix/x.png";
import youtube from "@/assets/SimpleGridWithPrefix/youtube.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

export const ICON_SRC = {
  facebook: toUrl(facebook),
  instagram: toUrl(instagram),
  linkedin: toUrl(linkedin),
  pinterest: toUrl(pinterest),
  snapchat: toUrl(snapchat),
  telegram: toUrl(telegram),
  tik_tok: toUrl(tikTok),
  twitter: toUrl(twitter),
  whatsapp: toUrl(whatsapp),
  x: toUrl(x),
  youtube: toUrl(youtube),
};

/**
 * Map icon values from API to ICON_SRC keys.
 */
export function mapIconToKey(icon) {
  if (!icon) return null;

  const normalizedIcon = String(icon).toLowerCase().trim();

  if (normalizedIcon === "tiktok") return "tik_tok";
  if (normalizedIcon === "threads" || normalizedIcon === "threeds") {
    return "twitter";
  }

  return normalizedIcon;
}

export function getIconSrc(icon) {
  const iconKey = mapIconToKey(icon);
  return iconKey && ICON_SRC[iconKey] ? ICON_SRC[iconKey] : "";
}

export const ICON_OPTIONS = Object.keys(ICON_SRC).map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
