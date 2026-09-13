export default function TextBlobHighlight({ position = "top" }) {
  const isTop = position === "top";

  return (
    <span
      className={`pointer-events-none absolute text-primary-1 ${
        isTop
          ? "top-[6%] end-[-2%] rotate-[18deg] sm:top-[8%] sm:end-[-4%]"
          : "bottom-[10%] start-[-2%] -rotate-[18deg] sm:bottom-[13%]"
      }`}
      aria-hidden="true"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
      >
        <path
          d="M20 6V16"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M28.5 11.5L21.5 17"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M11.5 11.5L18.5 17"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
