import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  ClockIcon,
  NavigationArrowIcon,
} from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  locationHasCoords,
  toEmailHref,
  toMapsHref,
  toPhoneHref,
} from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_LOCATION_DIRECTORY_STYLE,
} from "../utils/style";

function Row({ icon: Icon, color, children, href, dir }) {
  const content = (
    <span className="inline-flex items-start gap-2">
      <Icon size={16} weight="regular" aria-hidden className="mt-0.5 shrink-0" />
      <span dir={dir}>{children}</span>
    </span>
  );
  return (
    <li className={`${typography.caption}`} style={{ color }}>
      {href ? (
        <a href={href} className="no-underline hover:underline" style={{ color }}>
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}

export default function LocationCard({
  location,
  style = DEFAULT_LOCATION_DIRECTORY_STYLE,
  selectable = false,
  selected = false,
  onSelect,
}) {
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const metaCss = getThemeColorCss(style.metaColor, "600");
  const linkCss = getThemeColorCss(style.linkColor, "primary-1");
  const accentCss = getThemeColorCss(style.mapPinColor, "primary-1");
  const hasCoords = locationHasCoords(location);

  const selectableProps = selectable
    ? {
        role: "button",
        tabIndex: 0,
        "aria-pressed": selected,
        onClick: () => onSelect?.(),
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect?.();
          }
        },
      }
    : {};

  return (
    <article
      {...selectableProps}
      className={`flex flex-col gap-3 border p-4 md:p-5 ${radiusClass} ${
        selectable ? "cursor-pointer" : ""
      }`}
      style={{
        backgroundColor: style.showCardBg
          ? getThemeColorCss(style.cardBg, "background")
          : "transparent",
        borderColor: selected ? accentCss : getThemeColorCss("200", "200"),
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3
            className={`${typography.itemTitle} m-0`}
            style={{
              color: getThemeColorCss(style.nameColor, "700"),
              fontWeight: getFontWeightValue(style.nameFontWeight),
            }}
          >
            {location.name}
          </h3>
          {style.showCity && location.city ? (
            <span className={`${typography.caption}`} style={{ color: metaCss }}>
              {location.city}
            </span>
          ) : null}
        </div>
        {style.showMap && hasCoords ? (
          <a
            href={toMapsHref(location.lat, location.lng)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label="Open location in maps"
            className="shrink-0 rounded-md p-1 hover:bg-100"
            style={{ color: accentCss }}
          >
            <NavigationArrowIcon size={18} weight="regular" aria-hidden />
          </a>
        ) : null}
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {style.showAddress && location.address ? (
          <Row icon={MapPinIcon} color={metaCss}>
            {location.address}
          </Row>
        ) : null}
        {style.showPhone && location.phone ? (
          <Row
            icon={PhoneIcon}
            color={linkCss}
            href={toPhoneHref(location.phone)}
            dir="ltr"
          >
            {location.phone}
          </Row>
        ) : null}
        {style.showEmail && location.email ? (
          <Row
            icon={EnvelopeSimpleIcon}
            color={linkCss}
            href={toEmailHref(location.email)}
            dir="ltr"
          >
            {location.email}
          </Row>
        ) : null}
        {style.showHours && location.hours ? (
          <Row icon={ClockIcon} color={metaCss}>
            {location.hours}
          </Row>
        ) : null}
      </ul>
    </article>
  );
}
