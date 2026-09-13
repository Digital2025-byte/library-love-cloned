/**
 * Demo media library items for the CMS media picker.
 * Uses existing project assets plus a few travel stock URLs.
 */

import dual1 from "@/assets/DualImageText/ph1.png";
import dual2 from "@/assets/DualImageText/ph2.png";
import dual3 from "@/assets/DualImageText/ph3.png";
import dual4 from "@/assets/DualImageText/ph4.png";
import header1 from "@/assets/header/ph1.webp";
import header2 from "@/assets/header/ph2.webp";
import header3 from "@/assets/header/ph3.webp";
import dest1 from "@/assets/DestinationShowcase/ph1.png";
import dest2 from "@/assets/DestinationShowcase/ph2.png";
import dest3 from "@/assets/DestinationShowcase/ph3.png";
import carousel1 from "@/assets/CarouselItem/ph1.png";
import carousel2 from "@/assets/CarouselItem/ph2.png";
import carousel3 from "@/assets/CarouselItem/ph3.png";
import related1 from "@/assets/RelatedContentCarousel/ph1.png";
import related2 from "@/assets/RelatedContentCarousel/ph2.png";
import banner from "@/assets/banner.webp";
import travelHeader from "@/assets/travelHeader.webp";
import plane from "@/assets/splitWithImage/plane.png";
import sky from "@/assets/splitWithImage/sky.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

function item({ id, asset, title, alt, uploadedAt, width, height, sizeLabel }) {
  const url = toUrl(asset);
  return {
    id,
    url,
    title,
    alt: alt || title,
    caption: "",
    description: "",
    uploadedAt,
    width,
    height,
    sizeLabel,
    mimeType: url.endsWith(".webp") ? "image/webp" : "image/png",
    source: "library",
  };
}

export const DEMO_MEDIA_ITEMS = [
  item({
    id: "demo-header-1",
    asset: header1,
    title: "header-ph1.webp",
    alt: "Aircraft over destination skyline",
    uploadedAt: "March 12, 2025",
    width: 1920,
    height: 1080,
    sizeLabel: "420 KB",
  }),
  item({
    id: "demo-header-2",
    asset: header2,
    title: "header-ph2.webp",
    alt: "Cabin window view at sunset",
    uploadedAt: "March 12, 2025",
    width: 1920,
    height: 1080,
    sizeLabel: "390 KB",
  }),
  item({
    id: "demo-header-3",
    asset: header3,
    title: "header-ph3.webp",
    alt: "Traveler boarding gate",
    uploadedAt: "March 12, 2025",
    width: 1920,
    height: 1080,
    sizeLabel: "410 KB",
  }),
  item({
    id: "demo-dest-1",
    asset: dest1,
    title: "destination-ph1.png",
    alt: "City destination highlight",
    uploadedAt: "February 3, 2025",
    width: 1200,
    height: 800,
    sizeLabel: "510 KB",
  }),
  item({
    id: "demo-dest-2",
    asset: dest2,
    title: "destination-ph2.png",
    alt: "Coastal destination",
    uploadedAt: "February 3, 2025",
    width: 1200,
    height: 800,
    sizeLabel: "480 KB",
  }),
  item({
    id: "demo-dest-3",
    asset: dest3,
    title: "destination-ph3.png",
    alt: "Historic district aerial",
    uploadedAt: "February 3, 2025",
    width: 1200,
    height: 800,
    sizeLabel: "495 KB",
  }),
  item({
    id: "demo-dual-1",
    asset: dual1,
    title: "dual-image-ph1.png",
    alt: "Traveler exploring a scenic destination",
    uploadedAt: "January 18, 2025",
    width: 800,
    height: 1000,
    sizeLabel: "320 KB",
  }),
  item({
    id: "demo-dual-2",
    asset: dual2,
    title: "dual-image-ph2.png",
    alt: "Tropical beach destination",
    uploadedAt: "January 18, 2025",
    width: 800,
    height: 1000,
    sizeLabel: "305 KB",
  }),
  item({
    id: "demo-dual-3",
    asset: dual3,
    title: "dual-image-ph3.png",
    alt: "Onboard meal detail",
    uploadedAt: "January 18, 2025",
    width: 800,
    height: 1000,
    sizeLabel: "290 KB",
  }),
  item({
    id: "demo-dual-4",
    asset: dual4,
    title: "dual-image-ph4.png",
    alt: "Family traveling with infant",
    uploadedAt: "January 18, 2025",
    width: 800,
    height: 1000,
    sizeLabel: "315 KB",
  }),
  item({
    id: "demo-carousel-1",
    asset: carousel1,
    title: "carousel-ph1.png",
    alt: "Carousel travel photo 1",
    uploadedAt: "December 9, 2024",
    width: 900,
    height: 900,
    sizeLabel: "270 KB",
  }),
  item({
    id: "demo-carousel-2",
    asset: carousel2,
    title: "carousel-ph2.png",
    alt: "Carousel travel photo 2",
    uploadedAt: "December 9, 2024",
    width: 900,
    height: 900,
    sizeLabel: "265 KB",
  }),
  item({
    id: "demo-carousel-3",
    asset: carousel3,
    title: "carousel-ph3.png",
    alt: "Carousel travel photo 3",
    uploadedAt: "December 9, 2024",
    width: 900,
    height: 900,
    sizeLabel: "280 KB",
  }),
  item({
    id: "demo-related-1",
    asset: related1,
    title: "related-ph1.png",
    alt: "Related content image 1",
    uploadedAt: "November 22, 2024",
    width: 800,
    height: 600,
    sizeLabel: "240 KB",
  }),
  item({
    id: "demo-related-2",
    asset: related2,
    title: "related-ph2.png",
    alt: "Related content image 2",
    uploadedAt: "November 22, 2024",
    width: 800,
    height: 600,
    sizeLabel: "250 KB",
  }),
  item({
    id: "demo-banner",
    asset: banner,
    title: "banner.webp",
    alt: "FlyCham service banner",
    uploadedAt: "October 5, 2024",
    width: 1600,
    height: 900,
    sizeLabel: "360 KB",
  }),
  item({
    id: "demo-travel-header",
    asset: travelHeader,
    title: "travelHeader.webp",
    alt: "Travel header background",
    uploadedAt: "October 5, 2024",
    width: 1800,
    height: 1000,
    sizeLabel: "440 KB",
  }),
  item({
    id: "demo-plane",
    asset: plane,
    title: "plane.png",
    alt: "Airplane in flight",
    uploadedAt: "September 14, 2024",
    width: 1000,
    height: 700,
    sizeLabel: "380 KB",
  }),
  item({
    id: "demo-sky",
    asset: sky,
    title: "sky.webp",
    alt: "Sky and clouds",
    uploadedAt: "September 14, 2024",
    width: 1600,
    height: 900,
    sizeLabel: "300 KB",
  }),
  {
    id: "demo-stock-1",
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    title: "airplane-wing.webp",
    alt: "Airplane wing above the clouds",
    caption: "",
    description: "",
    uploadedAt: "August 1, 2024",
    width: 1200,
    height: 800,
    sizeLabel: "408 KB",
    mimeType: "image/jpeg",
    source: "library",
  },
  {
    id: "demo-stock-2",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    title: "tropical-beach.webp",
    alt: "Tropical beach destination",
    caption: "",
    description: "",
    uploadedAt: "August 1, 2024",
    width: 1200,
    height: 800,
    sizeLabel: "392 KB",
    mimeType: "image/jpeg",
    source: "library",
  },
];

export function createUploadedMediaItem(file, objectUrl) {
  return {
    id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url: objectUrl,
    title: file.name || "upload",
    alt: file.name?.replace(/\.[^.]+$/, "") || "Uploaded image",
    caption: "",
    description: "",
    uploadedAt: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    width: null,
    height: null,
    sizeLabel: formatBytes(file.size),
    mimeType: file.type || "image/*",
    source: "upload",
  };
}

function formatBytes(bytes = 0) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function mediaItemToUrl(item) {
  return item?.url || "";
}
