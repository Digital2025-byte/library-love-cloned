import Image from "next/image";
import { isUsableImageSrc } from "./helpers";

export default function MixedImageTile({
  image,
  className = "",
  sizes = "100vw",
  priority = false,
}) {
  const src = image?.fileUrl;
  if (!isUsableImageSrc(src)) {
    return <div className={`bg-surface-2 ${className}`} aria-hidden />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={image.alt || ""}
        fill
        className="object-cover object-center"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
