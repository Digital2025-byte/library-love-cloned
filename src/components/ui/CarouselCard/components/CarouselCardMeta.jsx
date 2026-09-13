import { CalendarCheckIcon, ClockIcon, StarIcon } from "@phosphor-icons/react";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";

export default function CarouselCardMeta({
  numberOfFlightsPerWeek,
  duration,
  lang,
  description,
  descriptionParts,
  linkStyle,
  showLinks = true,
  showNew = true,
  showFlights = true,
  showDuration = true,
  showDescription = true,
  metaColor = "50",
  bodyColor = "50",
}) {
  const metaCss = getThemeColorCss(metaColor, "50");
  const bodyCss = getThemeColorCss(bodyColor, "50");
  const metaParts = [
    showNew ? "new" : null,
    showFlights && (numberOfFlightsPerWeek || numberOfFlightsPerWeek === 0)
      ? "flights"
      : null,
    showDuration && duration ? "duration" : null,
  ].filter(Boolean);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-3 pb-2 sm:gap-1.5 sm:px-4 sm:pb-2.5">
      {metaParts.length ? (
        <div
          className={`${typography.caption} flex min-h-0 w-full flex-none flex-nowrap items-center gap-x-2 overflow-x-auto overscroll-x-contain font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          style={{ color: metaCss }}
        >
          {metaParts.map((part, index) => (
            <span key={part} className="contents">
              {index > 0 ? (
                <span
                  className="shrink-0"
                  style={{
                    color: `color-mix(in srgb, ${metaCss} 35%, transparent)`,
                  }}
                  aria-hidden
                >
                  |
                </span>
              ) : null}
              {part === "new" ? (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <StarIcon
                    weight="fill"
                    className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  New
                </span>
              ) : null}
              {part === "flights" ? (
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                  <CalendarCheckIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  {numberOfFlightsPerWeek}{" "}
                  {lang === "ar" ? "رحلات في الأسبوع" : "Flights per week"}
                </span>
              ) : null}
              {part === "duration" ? (
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                  <ClockIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  {`${lang === "ar" ? "مدة الرحلة" : "Duration"}: ${duration}`}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      {showDescription && description ? (
        <p
          className={`${typography.caption} min-h-0 flex-1 overflow-hidden text-start leading-snug font-light [overflow-wrap:anywhere] line-clamp-2 sm:line-clamp-3 lg:line-clamp-4`}
          style={{ color: bodyCss }}
        >
          <LinkedText
            text={description}
            parts={descriptionParts}
            style={linkStyle}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </div>
  );
}
