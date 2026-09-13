import { Fragment } from "react";
import { typography } from "@/styles/typography";

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

function renderValue(value) {
  if (!value) return null;

  const hasBrTag = /<br\s*\/?>/gi.test(value);

  if (hasBrTag) {
    const lines = value
      .split(/<br\s*\/?>/gi)
      .filter((line) => line.trim() !== "");

    return (
      <div className="flex flex-col gap-0">
        {lines.map((line, index) => (
          <Fragment key={index}>{renderLine(line)}</Fragment>
        ))}
      </div>
    );
  }

  return renderLine(value);
}

export default function ContactInfoItem({
  label,
  value,
  icon: Icon,
  lang = "en",
  iconCss,
  bodyCss,
}) {
  if (!value || !Icon) {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      <Icon
        size={22}
        weight="regular"
        className={`mt-0.5 shrink-0 ${
          lang === "ar" && isPhoneNumber(value) ? "-scale-x-100" : ""
        }`}
        style={{ color: iconCss || "var(--color-primary-2)" }}
      />
      <div className="flex min-w-0 flex-col gap-1">
        <span
          className={`${typography.caption} font-medium`}
          style={{ color: iconCss || "var(--color-primary-2)" }}
        >
          {label}
        </span>
        <div
          className={typography.itemDescription}
          style={{ color: bodyCss || "var(--color-secondary-2)" }}
        >
          {renderValue(value)}
        </div>
      </div>
    </div>
  );
}
