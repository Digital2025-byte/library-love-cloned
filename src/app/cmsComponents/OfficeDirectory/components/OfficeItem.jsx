import {
  ClockIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  MapPinLineIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { toEmailHref, toPhoneHref } from "../utils/helpers";
import { DEFAULT_OFFICE_DIRECTORY_STYLE } from "../utils/style";

function ContactRow({ icon: Icon, color, children }) {
  return (
    <div
      className={`flex items-start gap-2 md:gap-3 ${typography.caption} min-w-0`}
      style={{ color }}
    >
      <Icon
        size={16}
        weight="regular"
        className="mt-0.5 shrink-0"
        style={{ color }}
        aria-hidden
      />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export default function OfficeItem({
  office,
  labels,
  isLast,
  style = DEFAULT_OFFICE_DIRECTORY_STYLE,
}) {
  const rowColor = getThemeColorCss(style.rowColor, "800");
  const linkColor = getThemeColorCss(style.linkColor, "800");
  const buttonColor = getThemeColorCss(style.buttonColor, "primary-1");

  const button = (icon, label, href) => {
    const Icon = icon;
    return (
      <a
        href={href || undefined}
        className={`${typography.button} inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 font-medium no-underline transition-colors hover:bg-100 md:flex-none md:gap-2.5 md:px-6 md:py-2.5`}
        style={{ color: buttonColor, borderColor: buttonColor }}
      >
        <Icon size={16} weight="regular" className="shrink-0" aria-hidden />
        {label}
      </a>
    );
  };

  return (
    <div>
      <div className="flex items-start gap-3 py-6 md:gap-6 md:py-8">
        {style.showPin ? (
          <div className="relative z-10 flex w-9 shrink-0 justify-center md:w-11">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11"
              style={{ backgroundColor: getThemeColorCss(style.pinBg, "secondary-700") }}
            >
              <MapPinLineIcon
                size={22}
                weight="regular"
                aria-hidden
                style={{ color: getThemeColorCss(style.pinColor, "700") }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            <h3
              className={`${typography.itemTitle} m-0`}
              style={{
                color: getThemeColorCss(style.nameColor, "700"),
                fontWeight: getFontWeightValue(style.nameFontWeight),
              }}
            >
              {office.name}
            </h3>
            <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
              {office.address ? (
                <ContactRow icon={MapPinIcon} color={rowColor}>
                  {office.address}
                </ContactRow>
              ) : null}
              {office.phone ? (
                <ContactRow icon={PhoneIcon} color={rowColor}>
                  <span dir="ltr">{office.phone}</span>
                </ContactRow>
              ) : null}
              {office.email ? (
                <ContactRow icon={EnvelopeSimpleIcon} color={rowColor}>
                  <a
                    href={toEmailHref(office.email)}
                    className="no-underline hover:underline"
                    style={{ color: rowColor }}
                  >
                    {office.email}
                  </a>
                </ContactRow>
              ) : null}
              {office.hours ? (
                <ContactRow icon={ClockIcon} color={rowColor}>
                  {office.hours}
                </ContactRow>
              ) : null}
              {style.showWeekend && office.weekend ? (
                <span
                  className={`${typography.caption} ps-7`}
                  style={{ color: rowColor }}
                >
                  {labels.weekendLabel}: {office.weekend}
                </span>
              ) : null}
            </div>
          </div>

          {style.showButtons ? (
            <div className="flex w-full items-center gap-2 md:w-auto md:gap-4">
              {button(PhoneIcon, labels.callLabel, toPhoneHref(office.phone))}
              {button(EnvelopeSimpleIcon, labels.emailLabel, toEmailHref(office.email))}
            </div>
          ) : null}
        </div>
      </div>

      {!isLast ? (
        <hr
          className="m-0 border-none border-t ms-12 md:ms-[4.25rem]"
          style={{ borderColor: getThemeColorCss(style.dividerColor, "200") }}
        />
      ) : null}
    </div>
  );
}
