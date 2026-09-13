import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import ContactInfoItem from "./ContactInfoItem";
import { makeMapUrl } from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_MAP_INFO_STYLE,
} from "../utils/style";

export default function MapInfoDetails({
  office,
  labels,
  lang = "en",
  style = DEFAULT_MAP_INFO_STYLE,
}) {
  if (!office) {
    return null;
  }

  const contactFields = [
    style.showAddress
      ? {
          label: labels.address,
          value: office.address || "",
          icon: MapPinIcon,
        }
      : null,
    style.showPhone
      ? {
          label: labels.phone,
          value: office.phone || "",
          icon: PhoneIcon,
        }
      : null,
    style.showEmail
      ? {
          label: labels.email,
          value: office.email || "",
          icon: EnvelopeIcon,
        }
      : null,
    style.showHours
      ? {
          label: labels.workingHours,
          value: office.workingHours || "",
          icon: ClockIcon,
        }
      : null,
  ].filter((field) => field?.value);

  const mapUrl = makeMapUrl(office.latitude, office.longitude);
  const officeTitle = office.name || `${office.city} Branch`;
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const nameCss = getThemeColorCss(style.nameColor, "main");
  const iconCss = getThemeColorCss(style.iconColor, "primary-2");
  const bodyCss = getThemeColorCss(style.bodyColor, "secondary-2");
  const showHeading = style.showName && officeTitle;
  const showMap = style.showMap;

  if (!showHeading && !contactFields.length && !showMap) {
    return null;
  }

  return (
    <div className="px-2">
      <div
        className={`${radiusClass} p-4 pb-10 sm:p-6`}
        style={{
          backgroundColor: style.showCardBg
            ? getThemeColorCss(style.cardBg, "white")
            : "transparent",
        }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            {showHeading ? (
              <h3
                className={`${typography.itemTitle} font-medium`}
                style={{ color: nameCss, fontWeight: getFontWeightValue(style.nameFontWeight) }}
              >
                {officeTitle}
              </h3>
            ) : null}
            {contactFields.map((field) => (
              <ContactInfoItem
                key={field.label}
                {...field}
                lang={lang}
                iconCss={iconCss}
                bodyCss={bodyCss}
              />
            ))}
          </div>

          {showMap ? (
            <div className="h-64 min-h-70 w-full overflow-hidden rounded-xl bg-surface-1 lg:h-full lg:min-h-90">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${office.country} - ${office.city} office location`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-1 text-sm text-muted">
                  {labels.mapUnavailable}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
