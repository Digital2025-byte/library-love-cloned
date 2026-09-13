import {
  BuildingsIcon,
  GlobeHemisphereWestIcon,
  ClipboardTextIcon,
  HeadsetIcon,
  CreditCardIcon,
  WarningCircleIcon,
  ArrowUUpLeftIcon,
  TrolleySuitcaseIcon,
  WheelchairIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  ChatCircleTextIcon,
} from "@phosphor-icons/react";

/**
 * Composite "payment issue" glyph — a credit card with a small warning badge,
 * matching the source ContactForms icon.
 */
function PaymentIssueIcon({ size = 22, weight = "regular", ...props }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <CreditCardIcon size={size} weight={weight} {...props} />
      <WarningCircleIcon
        size={Math.round(size * 0.48)}
        weight="fill"
        className="absolute -top-0.5 -end-0.5 rounded-full bg-100"
        {...props}
      />
    </span>
  );
}

export const CONTACT_ICON_MAP = {
  buildings: BuildingsIcon,
  globe: GlobeHemisphereWestIcon,
  clipboard: ClipboardTextIcon,
  headset: HeadsetIcon,
  paymentIssue: PaymentIssueIcon,
  refund: ArrowUUpLeftIcon,
  baggage: TrolleySuitcaseIcon,
  wheelchair: WheelchairIcon,
  phone: PhoneIcon,
  envelope: EnvelopeSimpleIcon,
  chat: ChatCircleTextIcon,
};

export const CONTACT_ICON_OPTIONS = [
  { value: "buildings", label: "Buildings" },
  { value: "globe", label: "Globe" },
  { value: "clipboard", label: "Clipboard" },
  { value: "headset", label: "Headset" },
  { value: "paymentIssue", label: "Payment issue" },
  { value: "refund", label: "Refund" },
  { value: "baggage", label: "Baggage" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "phone", label: "Phone" },
  { value: "envelope", label: "Envelope" },
  { value: "chat", label: "Chat" },
];

export const DEFAULT_CONTACT_ICON = ClipboardTextIcon;

export function getContactIcon(name) {
  return CONTACT_ICON_MAP[name] || DEFAULT_CONTACT_ICON;
}
