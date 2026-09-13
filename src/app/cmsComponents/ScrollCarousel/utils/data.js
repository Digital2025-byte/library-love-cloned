import {
  CreditCardIcon,
  DeviceMobileIcon,
  GlobeIcon,
  LightningIcon,
  LockIcon,
  PaperPlaneTiltIcon,
  ShieldCheckIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";

const IMAGE =
  "https://images.pexels.com/photos/9934462/pexels-photo-9934462.jpeg";

export const features = [
  {
    icon: PaperPlaneTiltIcon,
    title: "Instant Payments",
    description:
      "Send money anywhere in the world instantly with zero fees for the first 6 months.",
    image: IMAGE,
  },
  {
    icon: GlobeIcon,
    title: "Global Currency Support",
    description:
      "Support for 150+ fiat currencies and 50+ cryptocurrencies in one unified wallet.",
    image: IMAGE,
  },
  {
    icon: ShieldCheckIcon,
    title: "Advanced Security",
    description:
      "Military-grade encryption with biometric authentication and fraud detection.",
    image: IMAGE,
  },
  {
    icon: CreditCardIcon,
    title: "Card Linking",
    description:
      "Link all your credit and debit cards for seamless payment management.",
    image: IMAGE,
  },
  {
    icon: LightningIcon,
    title: "Lightning Fast",
    description:
      "Experience transactions at the speed of light with our optimized network.",
    image: IMAGE,
  },
  {
    icon: DeviceMobileIcon,
    title: "Mobile First",
    description:
      "Designed for mobile with intuitive gestures and offline capabilities.",
    image: IMAGE,
  },
  {
    icon: TrendUpIcon,
    title: "Smart Analytics",
    description:
      "AI-powered insights to help you make better financial decisions.",
    image: IMAGE,
  },
  {
    icon: LockIcon,
    title: "Privacy Focused",
    description:
      "Your data stays private with end-to-end encryption and zero tracking.",
    image: IMAGE,
  },
];
