import { typography } from "@/styles/typography";

export default function UpperRightThreeImagesContent({
  title = "",
  description = "",
  className = "",
}) {
  return (
    <div className={`text-white ${className}`.trim()}>
      {title ? (
        <h2 className={`${typography.sectionTitle} font-semibold text-white`}>
          {title}
        </h2>
      ) : null}

      {description ? (
        <p
          className={`${typography.body} mt-3 leading-relaxed text-white/95 sm:mt-4`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
