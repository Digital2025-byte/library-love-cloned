export default function FullHeightHeaderWithTextContainer({
  lang,
  dir,
  children,
  className = "",
}) {
  return (
    <div
      className={`relative h-dvh min-h-dvh w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
    >
      {children}
    </div>
  );
}
