import Image from "next/image";
import { getThemeColorCss } from "@/styles/themeColors";

function isUsableImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CarouselCardMedia({
  src,
  cityName,
  imageAlt,
  isActive,
  showImage = true,
  showInactiveDim = true,
  overlayColor = "secondary-2",
}) {
  const overlayCss = getThemeColorCss(overlayColor, "secondary-2");

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full">
        {showImage && isUsableImageSrc(src) ? (
          <Image
            src={src}
            alt={imageAlt || cityName || "Destination"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 680px"
          />
        ) : (
          <div className="absolute inset-0 bg-primary-700" aria-hidden />
        )}
      </div>
      {showInactiveDim ? (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isActive ? "opacity-0" : "opacity-40"
          }`}
          style={{
            backgroundColor: `color-mix(in srgb, ${overlayCss} 30%, transparent)`,
          }}
        />
      ) : null}
    </div>
  );
}
