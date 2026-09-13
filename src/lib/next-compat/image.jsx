export default function Image({
  src,
  alt = "",
  fill = false,
  width,
  height,
  className,
  style,
  onLoad,
  onError,
}) {
  const resolvedSrc =
    typeof src === "string" ? src : src?.src || src?.default || "";

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              ...style,
            }
          : style
      }
      onLoad={onLoad}
      onError={onError}
    />
  );
}
