import {
  PhoneIcon,
  QuestionIcon,
  MapPinIcon,
  ClipboardTextIcon,
  PaperPlaneTiltIcon,
  MagnifyingGlassIcon,
  HeadsetIcon,
  ChatCircleTextIcon,
  EnvelopeSimpleIcon,
  InfoIcon,
  BuildingsIcon,
  GlobeHemisphereWestIcon,
  CreditCardIcon,
  ArrowUUpLeftIcon,
  TrolleySuitcaseIcon,
  WheelchairIcon,
} from "@phosphor-icons/react";

export const HELP_CATEGORY_ICON_MAP = {
  phone: PhoneIcon,
  question: QuestionIcon,
  mapPin: MapPinIcon,
  clipboard: ClipboardTextIcon,
  track: PaperPlaneTiltIcon,
  search: MagnifyingGlassIcon,
  headset: HeadsetIcon,
  chat: ChatCircleTextIcon,
  envelope: EnvelopeSimpleIcon,
  info: InfoIcon,
  buildings: BuildingsIcon,
  globe: GlobeHemisphereWestIcon,
  creditCard: CreditCardIcon,
  refund: ArrowUUpLeftIcon,
  suitcase: TrolleySuitcaseIcon,
  wheelchair: WheelchairIcon,
};

export const HELP_CATEGORY_ICON_OPTIONS = [
  { value: "phone", label: "Phone" },
  { value: "question", label: "Question" },
  { value: "mapPin", label: "Map pin" },
  { value: "clipboard", label: "Clipboard" },
  { value: "track", label: "Track" },
  { value: "search", label: "Search" },
  { value: "headset", label: "Headset" },
  { value: "chat", label: "Chat" },
  { value: "envelope", label: "Envelope" },
  { value: "info", label: "Info" },
  { value: "buildings", label: "Buildings" },
  { value: "globe", label: "Globe" },
  { value: "creditCard", label: "Credit card" },
  { value: "refund", label: "Refund" },
  { value: "suitcase", label: "Suitcase" },
  { value: "wheelchair", label: "Wheelchair" },
];

export const DEFAULT_HELP_CATEGORY_ICON = QuestionIcon;

export function getHelpCategoryIcon(iconName) {
  return HELP_CATEGORY_ICON_MAP[iconName] || DEFAULT_HELP_CATEGORY_ICON;
}
