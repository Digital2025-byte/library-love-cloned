import { Fragment } from "react";
import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_GRID_INFO_STYLE,
} from "../utils/style";

function isPhoneNumber(text) {
  if (!text) return false;
  const cleaned = text.replace(/[\s\-\(\)\+\.]/g, "");
  return /^\d{7,}$/.test(cleaned);
}

function isEmail(text) {
  if (!text) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
}

function renderLine(line) {
  const trimmedLine = line.trim();

  if (isPhoneNumber(trimmedLine)) {
    const phoneNumber = trimmedLine.replace(/[\s\-\(\)]/g, "");
    return (
      <a href={`tel:${phoneNumber}`} className="hover:underline" dir="ltr">
        {trimmedLine}
      </a>
    );
  }

  if (isEmail(trimmedLine)) {
    return (
      <a href={`mailto:${trimmedLine}`} className="hover:underline">
        {trimmedLine}
      </a>
    );
  }

  return <span>{trimmedLine}</span>;
}

function renderLabel(label) {
  if (!label) return null;

  const hasBrTag = /<br\s*\/?>/gi.test(label);

  if (hasBrTag) {
    const lines = label
      .split(/<br\s*\/?>/gi)
      .filter((line) => line.trim() !== "");

    return (
      <div className="flex flex-col gap-1.5">
        {lines.map((line, index) => (
          <Fragment key={index}>{renderLine(line)}</Fragment>
        ))}
      </div>
    );
  }

  return renderLine(label);
}

export default function GridInfoCard({
  item,
  lang = "en",
  style = DEFAULT_GRID_INFO_STYLE,
}) {
  if (!item) {
    return null;
  }

  const iconCss = getThemeColorCss(style.iconColor, "primary-2");
  const bodyCss = getThemeColorCss(style.bodyColor, "secondary-2");
  const nameCss = getThemeColorCss(style.nameColor, "main");
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.sm;
  const iconClassName = "mt-0.5 size-5 shrink-0";

  const contactInfo = [
    style.showAddress
      ? {
          icon: (
            <MapPinIcon className={iconClassName} style={{ color: iconCss }} />
          ),
          label: item.address,
          isMultiLine: true,
        }
      : null,
    style.showPhone
      ? {
          icon: (
            <PhoneIcon
              className={`${iconClassName} ${lang === "ar" ? "-scale-x-100" : ""}`}
              style={{ color: iconCss }}
            />
          ),
          label: item.phone,
        }
      : null,
    style.showEmail
      ? {
          icon: (
            <EnvelopeIcon className={iconClassName} style={{ color: iconCss }} />
          ),
          label: item.email,
        }
      : null,
    style.showHours
      ? {
          icon: (
            <ClockIcon className={iconClassName} style={{ color: iconCss }} />
          ),
          label: item.workingHoursText,
          isMultiLine: true,
        }
      : null,
  ].filter((info) => info?.label);

  const showHeading = style.showName && item.name;

  if (!showHeading && contactInfo.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-3 ${radiusClass} p-5 shadow-sm`}
      style={{
        backgroundColor: style.showCardBg
          ? getThemeColorCss(style.cardBg, "white")
          : "transparent",
      }}
    >
      {showHeading ? (
        <h3
          className={`${typography.itemTitle} font-medium`}
          style={{ color: nameCss, fontWeight: getFontWeightValue(style.nameFontWeight) }}
        >
          {item.name}
        </h3>
      ) : null}

      {contactInfo.map((contactItem, index) => {
        const hasMultiLine =
          contactItem.isMultiLine ||
          /<br\s*\/?>/gi.test(contactItem.label || "");

        return (
          <div
            key={index}
            className={`${typography.caption} flex gap-2 ${
              hasMultiLine ? "items-start" : "items-center"
            }`}
            style={{ color: bodyCss, fontWeight: getFontWeightValue(style.bodyFontWeight) }}
          >
            {contactItem.icon}
            {renderLabel(contactItem.label)}
          </div>
        );
      })}
    </div>
  );
}
