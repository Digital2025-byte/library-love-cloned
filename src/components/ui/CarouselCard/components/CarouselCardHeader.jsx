import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFlightsHref } from "../utils/helpers";

export default function CarouselCardHeader({
  cityName,
  originLabel,
  IATACode,
  posParams,
  lang,
  buttonLabel,
  showCity = true,
  showOrigin = true,
  showButton = true,
  cityColor = "50",
  originColor = "50",
  originBg = "900",
  buttonBg = "main",
  buttonText = "white",
}) {
  const label =
    buttonLabel || (lang === "ar" ? "تحقق من الرحلات" : "Check flights");
  const pillCss = getThemeColorCss(buttonBg, "main");
  const labelCss = getThemeColorCss(buttonText, "white");
  const originBgCss = getThemeColorCss(originBg, "900");

  return (
    <div className="flex flex-none items-center justify-between gap-2 overflow-visible px-3 pt-2.5 pb-1 sm:px-4 sm:pt-3 sm:pb-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-2 pe-2">
        {showCity && cityName ? (
          <h3
            className={`${typography.itemTitle} min-w-0 truncate text-start font-semibold`}
            style={{ color: getThemeColorCss(cityColor, "50") }}
          >
            {cityName}
          </h3>
        ) : null}
        {showOrigin && originLabel ? (
          <span
            className={`${typography.caption} -mt-1 inline-flex max-w-[min(100%,11rem)] shrink-0 items-center truncate rounded-full px-2.5 py-1 font-medium sm:max-w-[14rem]`}
            style={{
              color: getThemeColorCss(originColor, "50"),
              backgroundColor: `color-mix(in srgb, ${originBgCss} 30%, transparent)`,
            }}
          >
            {originLabel}
          </span>
        ) : null}
      </div>
      {showButton && label ? (
        <Button
          href={getFlightsHref(posParams, lang, IATACode)}
          label={label}
          className="pointer-events-auto relative z-20 shrink-0 -translate-y-1/2 border-1 !border-[var(--card-btn-bg)] !bg-[var(--card-btn-bg)] !p-3 !text-[var(--card-btn-fg)] hover:!opacity-90"
          onClick={(event) => event.stopPropagation()}
          variant="primary"
          style={{
            "--card-btn-bg": pillCss,
            "--card-btn-fg": labelCss,
            backgroundColor: pillCss,
            borderColor: pillCss,
            color: labelCss,
          }}
        />
      ) : null}
    </div>
  );
}
