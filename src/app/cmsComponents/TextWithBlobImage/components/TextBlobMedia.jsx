import Image from "next/image";
import blobMask from "@/assets/blob-mask.png";
import blobTicks from "@/assets/blob-ticks.png";
import { isUsableImageSrc } from "../utils/helpers";

const blobMaskUrl = typeof blobMask === "string" ? blobMask : blobMask.src;

export default function TextBlobMedia({ imageSrc, imageAlt = "" }) {
  const maskUrl = isUsableImageSrc(blobMaskUrl) ? blobMaskUrl : "";
  const canShowImage = isUsableImageSrc(imageSrc);

  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative h-[260px] w-[260px] sm:h-80 sm:w-80 md:h-[400px] md:w-[400px] lg:h-[440px] lg:w-[440px]">
        {canShowImage ? (
          <div
            className="absolute inset-0"
            style={
              maskUrl
                ? {
                    WebkitMaskImage: `url(${maskUrl})`,
                    maskImage: `url(${maskUrl})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }
                : undefined
            }
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              quality={75}
              priority
              className="object-cover object-center"
              sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 440px"
            />
          </div>
        ) : null}

        <Image
          src={blobTicks}
          alt=""
          fill
          priority
          className="pointer-events-none object-contain object-center"
          sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 440px"
        />
      </div>
    </div>
  );
}
