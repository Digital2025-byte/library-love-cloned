import dest1 from "@/assets/DestinationShowcase/ph1.png";
import dest2 from "@/assets/DestinationShowcase/ph2.png";
import dest3 from "@/assets/DestinationShowcase/ph3.png";
import dest4 from "@/assets/DestinationShowcase/ph4.png";
import car1 from "@/assets/CarouselItem/ph1.png";
import car2 from "@/assets/CarouselItem/ph2.png";
import car4 from "@/assets/CarouselItem/ph4.png";
import car5 from "@/assets/CarouselItem/ph5.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

const CITIES = [
  { title: "Damascus", image: dest1 },
  { title: "Dubai", image: dest2 },
  { title: "Baghdad", image: dest3 },
  { title: "Kuwait City", image: dest4 },
  { title: "Doha", image: car1 },
  { title: "Beirut", image: car2 },
  { title: "Dubai", image: car4 },
  { title: "Damascus", image: car5 },
];

export const sliderItems = CITIES.map((city, index) => ({
  title: city.title,
  num: String(index + 1).padStart(2, "0"),
  imageUrl: toUrl(city.image),
  data: { id: index + 1 },
}));
