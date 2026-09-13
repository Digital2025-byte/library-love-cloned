import {
  InspectorChoose,
  InspectorColor,
  InspectorFontWeight,
  InspectorSection,
  InspectorSelect,
  InspectorSwitch,
  InspectorTabs,
  applyInspectorReset,
} from "@/components/inspector";
import ContactCardsContentForm from "./ContactCardsContentForm";
import {
  COLUMNS_OPTIONS,
  CONTACT_CARDS_STYLE_RESET_KEYS,
  DEFAULT_CONTACT_CARDS_STYLE,
  SPACING_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  VARIANT_OPTIONS,
} from "../utils/style";

function ContactCardsStyleForm({ style, onChange }) {
  const update = (key, value) => onChange({ ...style, [key]: value });
  const toggle = (key) => onChange({ ...style, [key]: !style[key] });
  const reset = (keys) =>
    onChange(applyInspectorReset(style, DEFAULT_CONTACT_CARDS_STYLE, keys));

  return (
    <div>
      <InspectorSection
        title="Layout"
        onReset={() => reset(CONTACT_CARDS_STYLE_RESET_KEYS.layout)}
      >
        <InspectorSelect
          id="contact-cards-variant"
          label="Card style"
          value={style.variant}
          options={VARIANT_OPTIONS}
          onChange={(value) => update("variant", value)}
        />
        <InspectorChoose
          label="Columns"
          name="columns"
          value={style.columns}
          options={COLUMNS_OPTIONS}
          onChange={(value) => update("columns", value)}
        />
        <InspectorChoose
          label="Gap"
          name="cardGap"
          value={style.cardGap}
          options={SPACING_OPTIONS}
          onChange={(value) => update("cardGap", value)}
        />
        <InspectorChoose
          label="Padding"
          name="sectionPadding"
          value={style.sectionPadding}
          options={SPACING_OPTIONS}
          onChange={(value) => update("sectionPadding", value)}
        />
        <InspectorSwitch
          checked={style.showSectionBg}
          onChange={() => toggle("showSectionBg")}
          label="Section background"
        />
        {style.showSectionBg ? (
          <InspectorColor
            label="Section background"
            value={style.sectionBg}
            onChange={(value) => update("sectionBg", value)}
          />
        ) : null}
        <InspectorSwitch
          checked={style.showFooterLink}
          onChange={() => toggle("showFooterLink")}
          label="Footer link"
          hint="Show the 'view all' link (Forms variant)"
        />
        {style.showFooterLink ? (
          <InspectorColor
            label="Footer link color"
            value={style.footerColor}
            onChange={(value) => update("footerColor", value)}
          />
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Header"
        onReset={() => reset(CONTACT_CARDS_STYLE_RESET_KEYS.header)}
      >
        <InspectorSwitch
          checked={style.showHeader}
          onChange={() => toggle("showHeader")}
          label="Header"
        />
        {style.showHeader ? (
          <>
            <InspectorSwitch
              checked={style.showTitle}
              onChange={() => toggle("showTitle")}
              label="Title"
            />
            {style.showTitle ? (
              <>
                <InspectorColor
                  label="Title color"
                  value={style.titleColor}
                  onChange={(value) => update("titleColor", value)}
                />
                <InspectorFontWeight
                  id="contactCards-title-weight"
                  label="Title weight"
                  value={style.titleFontWeight}
                  onChange={(value) => update("titleFontWeight", value)}
                />
              </>
            ) : null}
            <InspectorSwitch
              checked={style.showSubtitle}
              onChange={() => toggle("showSubtitle")}
              label="Subtitle"
            />
            {style.showSubtitle ? (
              <InspectorColor
                label="Subtitle color"
                value={style.subtitleColor}
                onChange={(value) => update("subtitleColor", value)}
              />
            ) : null}
            <InspectorChoose
              label="Alignment"
              name="titleAlign"
              value={style.titleAlign}
              options={TITLE_ALIGN_OPTIONS}
              onChange={(value) => update("titleAlign", value)}
            />
          </>
        ) : null}
      </InspectorSection>

      <InspectorSection
        title="Cards"
        onReset={() => reset(CONTACT_CARDS_STYLE_RESET_KEYS.cards)}
      >
        <InspectorColor
          label="Card background"
          value={style.cardBg}
          onChange={(value) => update("cardBg", value)}
        />
        <InspectorColor
          label="Icon background"
          value={style.iconBg}
          onChange={(value) => update("iconBg", value)}
        />
        <InspectorColor
          label="Icon color"
          value={style.iconColor}
          onChange={(value) => update("iconColor", value)}
        />
        <InspectorColor
          label="Card title color"
          value={style.cardTitleColor}
          onChange={(value) => update("cardTitleColor", value)}
        />
        <InspectorFontWeight
          id="contactCards-card-title-weight"
          label="Card title weight"
          value={style.cardTitleFontWeight}
          onChange={(value) => update("cardTitleFontWeight", value)}
        />
        <InspectorColor
          label="Description color"
          value={style.cardDescriptionColor}
          onChange={(value) => update("cardDescriptionColor", value)}
        />
        <InspectorColor
          label="Button background (Channels)"
          value={style.buttonBg}
          onChange={(value) => update("buttonBg", value)}
        />
        <InspectorColor
          label="Button hover (Channels)"
          value={style.buttonHoverBg}
          onChange={(value) => update("buttonHoverBg", value)}
        />
        <InspectorColor
          label="Button focus ring (Channels)"
          value={style.buttonFocusRing}
          onChange={(value) => update("buttonFocusRing", value)}
        />
        <InspectorColor
          label="Button text (Channels)"
          value={style.buttonText}
          onChange={(value) => update("buttonText", value)}
        />
        <InspectorColor
          label="Arrow background"
          value={style.arrowBg}
          onChange={(value) => update("arrowBg", value)}
        />
        <InspectorColor
          label="Arrow color"
          value={style.arrowColor}
          onChange={(value) => update("arrowColor", value)}
        />
      </InspectorSection>
    </div>
  );
}

export default function ContactCardsPropsForm({
  content,
  onContentChange,
  contentDefaults,
  style,
  onStyleChange,
}) {
  return (
    <InspectorTabs
      content={
        <ContactCardsContentForm
          content={content}
          onChange={onContentChange}
          defaults={contentDefaults}
        />
      }
      style={<ContactCardsStyleForm style={style} onChange={onStyleChange} />}
    />
  );
}
