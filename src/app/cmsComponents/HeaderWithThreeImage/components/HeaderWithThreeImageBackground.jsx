import HeaderWithThreeImageSlice from "./HeaderWithThreeImageSlice";
import { getHeaderClipPaths } from "../utils/clipPaths";
import { getImageCount, HEIGHT_CLASS } from "../utils/style";

export default function HeaderWithThreeImageBackground({
  lang = "en",
  content,
  style,
  heightClass = HEIGHT_CLASS.default,
  direction = "right",
}) {
  const isRtl = lang === "ar";
  const imageCount = getImageCount(style);
  const paths = getHeaderClipPaths(direction, { count: imageCount });

  const threeLtr = [
    {
      key: "one",
      width: paths.LEFT_W,
      clipPath: paths.leftClipPath,
      desktopImage: content.imageOne,
      mobileImage: content.mobileImageOne,
      priority: true,
    },
    {
      key: "two",
      width: paths.MID_W,
      clipPath: paths.midClipPath,
      overlapStyle: paths.overlapStyle,
      desktopImage: content.imageTwo,
      mobileImage: content.mobileImageTwo,
    },
    {
      key: "three",
      width: paths.RIGHT_W,
      clipPath: paths.rightClipPath,
      overlapStyle: paths.overlapStyle,
      desktopImage: content.imageThree,
      mobileImage: content.mobileImageThree,
    },
  ];

  const threeRtl = [
    {
      key: "three",
      width: paths.LEFT_W,
      clipPath: paths.leftClipPath,
      desktopImage: content.imageThree,
      mobileImage: content.mobileImageThree,
    },
    {
      key: "two",
      width: paths.MID_W,
      clipPath: paths.midClipPath,
      overlapStyle: paths.overlapStyle,
      desktopImage: content.imageTwo,
      mobileImage: content.mobileImageTwo,
    },
    {
      key: "one",
      width: paths.RIGHT_W,
      clipPath: paths.rightClipPath,
      overlapStyle: paths.overlapStyle,
      desktopImage: content.imageOne,
      mobileImage: content.mobileImageOne,
      priority: true,
    },
  ];

  const twoLtr = [
    {
      key: "one",
      width: paths.LEFT_W,
      clipPath: paths.leftClipPath,
      desktopImage: content.imageOne,
      mobileImage: content.mobileImageOne,
      priority: true,
    },
    {
      key: "two",
      width: paths.RIGHT_W,
      clipPath: paths.rightClipPath,
      overlapStyle: paths.overlapStyle,
      desktopImage: content.imageTwo,
      mobileImage: content.mobileImageTwo,
    },
  ];

  const twoRtl = [
    {
      key: "two",
      width: paths.LEFT_W,
      clipPath: paths.leftClipPath,
      desktopImage: content.imageTwo,
      mobileImage: content.mobileImageTwo,
    },
    {
      key: "one",
      width: paths.RIGHT_W,
      clipPath: paths.rightClipPath,
      overlapStyle: paths.overlapStyle,
      desktopImage: content.imageOne,
      mobileImage: content.mobileImageOne,
      priority: true,
    },
  ];

  const slices =
    imageCount === 2
      ? isRtl
        ? twoRtl
        : twoLtr
      : isRtl
        ? threeRtl
        : threeLtr;

  return (
    <div dir="ltr" className={`absolute inset-0 flex w-full ${heightClass}`}>
      {slices.map((slice) => (
        <HeaderWithThreeImageSlice
          key={slice.key}
          width={slice.width}
          clipPath={slice.clipPath}
          overlapStyle={slice.overlapStyle}
          desktopImage={slice.desktopImage}
          mobileImage={slice.mobileImage}
          heightClass={heightClass}
          priority={Boolean(slice.priority)}
          style={style}
        />
      ))}
    </div>
  );
}
