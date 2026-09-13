import {
  CalendarIcon,
  AirTrafficControlIcon,
  AirplaneTiltIcon,
  TrolleySuitcaseIcon,
  MapPinIcon,
  TicketIcon,
  SuitcaseRollingIcon,
  ClockIcon,
} from "@phosphor-icons/react";

export const JOURNEY_ICON_MAP = {
  calendar: CalendarIcon,
  airport: AirTrafficControlIcon,
  airplane: AirplaneTiltIcon,
  suitcase: TrolleySuitcaseIcon,
  mapPin: MapPinIcon,
  ticket: TicketIcon,
  baggage: SuitcaseRollingIcon,
  clock: ClockIcon,
};

export const JOURNEY_ICON_OPTIONS = [
  { value: "calendar", label: "Calendar" },
  { value: "airport", label: "Airport" },
  { value: "airplane", label: "Airplane" },
  { value: "suitcase", label: "Suitcase" },
  { value: "mapPin", label: "Map pin" },
  { value: "ticket", label: "Ticket" },
  { value: "baggage", label: "Baggage" },
  { value: "clock", label: "Clock" },
];

export const DEFAULT_JOURNEY_ICON = CalendarIcon;

export function getJourneyIcon(iconName) {
  return JOURNEY_ICON_MAP[iconName] || DEFAULT_JOURNEY_ICON;
}
