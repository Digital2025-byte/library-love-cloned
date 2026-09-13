import { ChatsIcon } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_LIVE_CHAT_BANNER_STYLE,
  PANEL_PADDING_CLASS,
  PANEL_RADIUS_CLASS,
} from "../utils/style";

export default function LiveChatBannerPanel({
  content,
  style = DEFAULT_LIVE_CHAT_BANNER_STYLE,
}) {
  const paddingClass =
    PANEL_PADDING_CLASS[style.panelPadding] ?? PANEL_PADDING_CLASS.default;
  const radiusClass =
    PANEL_RADIUS_CLASS[style.panelRadius] ?? PANEL_RADIUS_CLASS.lg;

  const panelBgCss = getThemeColorCss(style.panelBg, "primary-1");
  const opacity = Number(style.panelBgOpacity) || 100;
  const panelBg =
    opacity >= 100
      ? panelBgCss
      : `color-mix(in srgb, ${panelBgCss} ${opacity}%, transparent)`;

  const showTitle = style.showTitle && content.title;
  const showDescription = style.showDescription && content.description;
  const showButton = style.showButton && content.ctaLabel;

  return (
    <div
      className={`${paddingClass} ${radiusClass}`}
      style={{ backgroundColor: panelBg }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {style.showIcon ? (
            <ChatsIcon
              size={38}
              weight="regular"
              aria-hidden
              className="shrink-0"
              style={{ color: getThemeColorCss(style.iconColor, "700") }}
            />
          ) : null}
          <div className="flex min-w-0 flex-col gap-1">
            {showTitle ? (
              <h2
                className={`${typography.itemTitle} m-0`}
                style={{
                  color: getThemeColorCss(style.titleColor, "700"),
                  fontWeight: getFontWeightValue(style.titleFontWeight),
                }}
              >
                {content.title}
              </h2>
            ) : null}
            {showDescription ? (
              <p
                className={`${typography.itemDescription} m-0 leading-relaxed`}
                style={{
                  color: getThemeColorCss(style.descriptionColor, "800"),
                  fontWeight: getFontWeightValue(style.descriptionFontWeight),
                }}
              >
                {content.description}
              </p>
            ) : null}
          </div>
        </div>

        {showButton ? (
          <Button
            label={content.ctaLabel}
            href={content.ctaHref || undefined}
            className="w-full shrink-0 md:w-auto"
            style={{
              backgroundColor: getThemeColorCss(style.buttonBg, "primary-1"),
              borderColor: getThemeColorCss(style.buttonBg, "primary-1"),
              color: getThemeColorCss(style.buttonText, "50"),
              fontWeight: getFontWeightValue(style.buttonFontWeight),
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
