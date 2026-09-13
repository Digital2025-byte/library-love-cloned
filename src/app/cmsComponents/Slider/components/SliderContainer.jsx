export default function SliderContainer({ lang, children, className = "" }) {
  // Always LTR shell — parent `dir=rtl` breaks react-slick track position.
  // Arabic text direction is applied inside each slide's content.
  return (
    <div
      className={`relative w-full overflow-hidden leading-none ${className}`.trim()}
      lang={lang}
      dir="ltr"
    >
      {children}
    </div>
  );
}
