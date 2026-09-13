import {
  ArrowsClockwiseIcon,
  CarIcon,
  IdentificationCardIcon,
  CreditCardIcon,
  BabyIcon,
  UsersThreeIcon,
  BriefcaseIcon,
  WheelchairIcon,
  FirstAidIcon,
  ArrowUUpLeftIcon,
  TrolleySuitcaseIcon,
  SuitcaseIcon,
  ChatTextIcon,
  TicketIcon,
  PackageIcon,
  MedalIcon,
  PlugsIcon,
  HandshakeIcon,
} from "@phosphor-icons/react";

export const FORM_ICON_MAP = {
  change: ArrowsClockwiseIcon,
  transport: CarIcon,
  name: IdentificationCardIcon,
  payment: CreditCardIcon,
  minor: BabyIcon,
  group: UsersThreeIcon,
  corporate: BriefcaseIcon,
  wheelchair: WheelchairIcon,
  medical: FirstAidIcon,
  refund: ArrowUUpLeftIcon,
  baggage: TrolleySuitcaseIcon,
  suitcase: SuitcaseIcon,
  feedback: ChatTextIcon,
  ticket: TicketIcon,
  package: PackageIcon,
  medal: MedalIcon,
  plugs: PlugsIcon,
  handshake: HandshakeIcon,
};

export const FORM_ICON_OPTIONS = [
  { value: "change", label: "Change" },
  { value: "transport", label: "Transport" },
  { value: "name", label: "Name / ID" },
  { value: "payment", label: "Payment" },
  { value: "minor", label: "Minor" },
  { value: "group", label: "Group" },
  { value: "corporate", label: "Corporate" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "medical", label: "Medical" },
  { value: "refund", label: "Refund" },
  { value: "baggage", label: "Baggage (trolley)" },
  { value: "suitcase", label: "Suitcase" },
  { value: "feedback", label: "Feedback" },
  { value: "ticket", label: "Ticket" },
  { value: "package", label: "Package" },
  { value: "medal", label: "Medal" },
  { value: "plugs", label: "Plugs / API" },
  { value: "handshake", label: "Handshake" },
];

export const DEFAULT_FORM_ICON = TicketIcon;

export function getFormIcon(iconName) {
  return FORM_ICON_MAP[iconName] || DEFAULT_FORM_ICON;
}
