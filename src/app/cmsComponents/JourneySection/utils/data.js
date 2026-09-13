const STEP_SEED = [
  {
    id: "before",
    icon: "calendar",
    linkKeys: ["baggageAllowance", "travelWithChildren", "seatSelection", "yaMarhaba"],
  },
  {
    id: "airport",
    icon: "airport",
    linkKeys: ["vipBoarding", "specialServices", "businessLounge", "excessBaggage"],
  },
  {
    id: "onboard",
    icon: "airplane",
    linkKeys: ["mealService", "birthdayCake", "wifi", "entertainment"],
  },
  {
    id: "after",
    icon: "suitcase",
    linkKeys: ["refunds", "lostAndFound", "baggageQueries", "feedback"],
  },
];

/**
 * Builds CMS-shaped JourneySection data from i18next translations.
 */
export function buildJourneySectionData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("journeySection.title"),
          subtitle: t("journeySection.subtitle"),
          steps: STEP_SEED.map((step) => ({
            icon: step.icon,
            title: t(`journeySection.steps.${step.id}.title`),
            links: step.linkKeys.map((key) => ({
              text: t(`journeySection.steps.${step.id}.links.${key}`),
              href: "",
            })),
          })),
        },
      },
    ],
  };
}
