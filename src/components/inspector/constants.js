import { typography } from "@/styles/typography";

export const inspectorControlClass = `${typography.caption} w-full rounded-sm border border-200 bg-white px-2.5 py-2 text-foreground outline-none focus:border-800`;

export const inspectorIconHoverClass =
  "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100";

export const ALIGNMENT_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
  { value: "right", label: "End" },
];

export const LINK_TYPE_OPTIONS = [
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
];
