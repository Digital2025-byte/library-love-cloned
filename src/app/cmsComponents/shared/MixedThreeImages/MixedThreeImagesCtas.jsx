"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_MIXED_THREE_IMAGES_STYLE } from "@/app/cmsComponents/MixedRightThreeImages/utils/style";

export default function MixedThreeImagesCtas({
  lang = "en",
  primaryCta,
  secondaryCta,
  className = "",
  fullWidth = false,
  style = DEFAULT_MIXED_THREE_IMAGES_STYLE,
}) {
  const showPrimaryBtn = style.showPrimary && primaryCta?.label;
  const showSecondaryBtn = style.showSecondary && secondaryCta?.label;

  if (!showPrimaryBtn && !showSecondaryBtn) {
    return null;
  }

  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeftIcon : ArrowRightIcon;
  const primaryBgCss = getThemeColorCss(style.primaryBg, "primary-2");
  const primaryTextCss = getThemeColorCss(style.primaryText, "white");
  const secondaryCss = getThemeColorCss(style.secondaryText, "white");

  return (
    <div
      className={[
        fullWidth
          ? "flex flex-col gap-3"
          : "mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showPrimaryBtn ? (
        <Button
          label={primaryCta.label}
          href={primaryCta.href || "/"}
          icon={<ArrowIcon size={18} weight="bold" aria-hidden />}
          iconPosition="end"
          variant="primary"
          fullWidth={fullWidth}
          style={{
            backgroundColor: primaryBgCss,
            borderColor: primaryBgCss,
            color: primaryTextCss,
            fontWeight: getFontWeightValue(style.primaryTextFontWeight),
          }}
        />
      ) : null}

      {showSecondaryBtn ? (
        <Button
          label={secondaryCta.label}
          href={secondaryCta.href || "/"}
          icon={<BookOpenIcon size={18} weight="regular" aria-hidden />}
          iconPosition="start"
          variant="secondary"
          fullWidth={fullWidth}
          style={{
            backgroundColor: "transparent",
            borderColor: secondaryCss,
            color: secondaryCss,
            fontWeight: getFontWeightValue(style.secondaryTextFontWeight),
          }}
        />
      ) : null}
    </div>
  );
}
