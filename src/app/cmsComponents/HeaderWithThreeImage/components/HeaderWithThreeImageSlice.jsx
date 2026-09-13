import Image from "next/image";
import { getObjectFitClass } from "@/app/cmsComponents/shared/backgroundImage";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
  HEIGHT_CLASS,
} from "../utils/style";

export default function HeaderWithThreeImageSlice({
  width,
  overlapStyle,
  clipPath,
  desktopImage,
  mobileImage,
  heightClass = HEIGHT_CLASS.default,
  priority = false,
  style = DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
}) {
  const desktopSrc = isUsableImageSrc(desktopImage?.fileUrl)
    ? encodeURI(desktopImage.fileUrl)
    : "";
  const mobileRaw = mobileImage?.fileUrl || desktopImage?.fileUrl;
  const mobileSrc = isUsableImageSrc(mobileRaw) ? encodeURI(mobileRaw) : desktopSrc;
  const objectFitClass = getObjectFitClass(style);

  if (!desktopSrc && !mobileSrc) {
    return (
      <div
        style={{ width, ...overlapStyle }}
        className={`relative shrink-0 ${heightClass}`}
      />
    );
  }

  return (
    <div
      style={{ width, ...overlapStyle }}
      className={`relative shrink-0 ${heightClass}`}
    >
      <div className="absolute inset-0 will-change-transform" style={{ clipPath }}>
        {desktopSrc ? (
          <Image
            src={desktopSrc}
            alt={desktopImage?.alt || "Background image"}
            fill
            priority={priority}
            sizes="50vw"
            className={`hidden lg:block ${objectFitClass}`}
            quality={75}
            unoptimized={desktopSrc.startsWith("http")}
          />
        ) : null}
        {mobileSrc ? (
          <Image
            src={mobileSrc}
            alt={mobileImage?.alt || desktopImage?.alt || "Background image"}
            fill
            priority={priority}
            sizes="100vw"
            className={`lg:hidden ${objectFitClass}`}
            quality={75}
            unoptimized={mobileSrc.startsWith("http")}
          />
        ) : null}
      </div>
    </div>
  );
}
