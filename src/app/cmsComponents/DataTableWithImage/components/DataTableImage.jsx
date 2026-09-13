import Image from "next/image";
import { isUsableImageSrc } from "../utils/helpers";

export default function DataTableImage({
  imageSrc = "",
  imageAlt = "",
}) {
  if (!isUsableImageSrc(imageSrc)) {
    return null;
  }

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px]">
      <Image
        src={imageSrc}
        alt={imageAlt || ""}
        fill
        className="object-contain"
        sizes="(max-width: 1024px) 100vw, 360px"
      />
    </div>
  );
}
