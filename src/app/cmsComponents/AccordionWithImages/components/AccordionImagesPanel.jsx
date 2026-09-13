import Image from "next/image";
import { getThemeColorCss } from "@/styles/themeColors";
import { ITEM_RADIUS_CLASS } from "../utils/style";

export default function AccordionImagesPanel({
  items,
  activeIndex,
  radius = "lg",
  background = "100",
}) {
  const layers = Array.isArray(items) ? items : [];
  const hasImages = layers.some((item) => item?.image);
  const radiusClass = ITEM_RADIUS_CLASS[radius] ?? ITEM_RADIUS_CLASS.lg;
  const backgroundCss = getThemeColorCss(background, "100");

  if (!hasImages) {
    return (
      <div
        className={`relative h-64 w-full overflow-hidden sm:h-80 lg:h-150 ${radiusClass}`}
        style={{ backgroundColor: backgroundCss }}
      />
    );
  }

  return (
    <div
      className={`relative h-64 w-full overflow-hidden sm:h-80 lg:h-150 ${radiusClass}`}
      style={{ backgroundColor: backgroundCss }}
    >
      {layers.map((item, index) =>
        item?.image ? (
          <Image
            key={index}
            src={item.image}
            alt={item.imageAlt || "Service Image"}
            fill
            priority={index === 0}
            quality={75}
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null,
      )}
    </div>
  );
}
