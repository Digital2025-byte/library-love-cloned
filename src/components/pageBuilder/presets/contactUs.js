/**
 * Contact Us page (/help/contact-us).
 *
 * Reuses existing components with page-specific content presets — no new
 * component per section. Content mirrors the new Fly Cham contact page.
 *
 *   page-hero        → contact hero
 *   help-categories  → "How would you like to contact us?" (3 channel cards)
 *   help-categories  → "Choose the right form" (4 form cards)
 *   live-chat-banner → live chat
 *   get-in-touch     → general enquiries
 *   cta-banner       → flight status promo
 */
const HERO_IMAGE = "/help/contact-us/ph1.png";
const HERO_MASK = "/help/contact-us/mask.png";
const AGENT_IMAGE = "/help/contact-us/ph2.png";
const FLIGHT_IMAGE = "/help/contact-us/banner.png";

export const contactUsBlocks = [
  {
    sectionId: "page-hero",
    content: {
      en: {
        title: "Contact Us",
        subtitle:
          "Choose the support channel that best matches what you need",
        imageUrl: HERO_IMAGE,
        imageMask: HERO_MASK,
        imageAlt: "Fly Cham customer service agent",
      },
      ar: {
        title: "تواصل معنا",
        subtitle: "اختر قناة التواصل المناسبة للحصول على الخدمات التي تحتاجها",
        imageUrl: HERO_IMAGE,
        imageMask: HERO_MASK,
        imageAlt: "موظفة خدمة زبائن فلاي شام",
      },
    },
  },
  {
    sectionId: "contact-cards",
    style: { variant: "channels", columns: "3" },
    content: {
      en: {
        title: "How would you like to contact us?",
        subtitle: "",
        cards: [
          {
            icon: "buildings",
            title: "Visit Our Sales Offices",
            description:
              "Get in-person assistance through our sales office for bookings, flight changes, travel services, and others.",
            cta: "Discover Our Sales Offices",
            href: "/help/contact-us/our-offices",
          },
          {
            icon: "globe",
            title: "Contact General Sales Agent",
            description:
              "Discover our network of General Sales Agents located across various regions, dedicated to providing excellent services and meeting your needs.",
            cta: "Discover GSA Network",
            href: "/help/contact-us/our-gsa",
          },
          {
            icon: "clipboard",
            title: "Submit a Request Online",
            description:
              "Choose the right form for your request, refunds, baggage matters, special assistance, complaints, feedback, and other available requests.",
            cta: "Browse Forms",
            href: "/help/contact-us/forms",
          },
        ],
      },
      ar: {
        title: "كيف ترغب في التواصل معنا؟",
        subtitle: "",
        cards: [
          {
            icon: "buildings",
            title: "مكاتب مبيعاتنا",
            description:
              "احصل على المساعدة من خلال مكاتب مبيعاتنا فيما يخص الحجز، تعديل الرحلات وغيرها من خدمات السفر المتاحة.",
            cta: "تعرّف على مكاتب مبيعاتنا",
            href: "/help/contact-us/our-offices",
          },
          {
            icon: "globe",
            title: "تواصل مع وكلائنا",
            description:
              "يمكنك التواصل مع أحد وكلائنا المنتشرين في عدة مناطق لتقديم أفضل الخدمات ومساعدتك في حجوزاتك، والاستفسارات، وتقديم المشورة لخطط سفرك.",
            cta: "تعرف على شبكة وكلائنا",
            href: "/help/contact-us/our-gsa",
          },
          {
            icon: "clipboard",
            title: "النماذج وطلبات الخدمة",
            description:
              "قدّم طلبك إلكترونياً من خلال النموذج المخصص للخدمة التي تحتاجها، بما في ذلك طلبات الاسترداد، الأمتعة، المساعدة الخاصة، الشكاوى والملاحظات.",
            cta: "تصفّح النماذج",
            href: "/help/contact-us/forms",
          },
        ],
      },
    },
  },
  {
    sectionId: "contact-cards",
    style: {
      variant: "forms",
      columns: "4",
      showFooterLink: true,
      titleFontWeight: "semibold",
      cardTitleFontWeight: "semibold",
      cardDescriptionColor: "700",
    },
    content: {
      en: {
        title: "Choose the right form",
        subtitle: "Use a quick form to reach the right team.",
        footerLabel: "View all forms",
        footerHref: "/help/contact-us/forms",
        cards: [
          {
            icon: "paymentIssue",
            title: "Payment issue",
            description: "Report an unsuccessful payment, duplicate charge",
            href: "#",
          },
          {
            icon: "refund",
            title: "Refund request",
            description:
              "Request a refund for an eligible Fly Cham booking or service.",
            href: "#",
          },
          {
            icon: "baggage",
            title: "Delayed baggage",
            description: "Submit details about checked baggage that did not arrive",
            href: "#",
          },
          {
            icon: "wheelchair",
            title: "Special assistance",
            description:
              "Request mobility assistance or another airport support service",
            href: "#",
          },
        ],
      },
      ar: {
        title: "اختر النموذج المناسب",
        subtitle: "استخدم نموذجاً سريعاً للوصول إلى الفريق المختص.",
        footerLabel: "عرض كل النماذج",
        footerHref: "/help/contact-us/forms",
        cards: [
          {
            icon: "paymentIssue",
            title: "مشكلة في الدفع",
            description: "أبلغ عن عملية دفع غير ناجحة أو رسوم مكررة",
            href: "#",
          },
          {
            icon: "refund",
            title: "طلب استرداد",
            description: "اطلب استرداداً لحجز أو خدمة مؤهلة لدى فلاي شام.",
            href: "#",
          },
          {
            icon: "baggage",
            title: "أمتعة متأخرة",
            description: "قدّم تفاصيل عن الأمتعة المسجلة التي لم تصل",
            href: "#",
          },
          {
            icon: "wheelchair",
            title: "مساعدة خاصة",
            description: "اطلب مساعدة في التنقل أو خدمة دعم أخرى في المطار",
            href: "#",
          },
        ],
      },
    },
  },
  {
    sectionId: "live-chat-banner",
    content: {
      en: {
        title: "Start Live Chat",
        description:
          "Chat with our Customer Service team and get immediate support for your questions and inquiries.",
        buttonLabel: "Chat now",
        buttonHref: "",
        buttonLinkType: "external",
      },
      ar: {
        title: "ابدأ الدردشة",
        description:
          "تحدّث مباشرةً مع فريق خدمة زبائن فلاي شام واحصل على الدعم الفوري لأسئلتك واستفساراتك.",
        buttonLabel: "تحدث الآن",
        buttonHref: "",
        buttonLinkType: "external",
      },
    },
  },
  {
    sectionId: "get-in-touch",
    content: {
      en: {
        title: "Get in touch",
        label: "General enquiries",
        phoneDisplay: "+963 -11-2122222",
        phoneHref: "tel:+963112122222",
        hours: "Customer Support Hotline: Open from 9 AM to 9 PM",
        note: "Get in touch with our Customer Care team for urgent assistance with bookings, flight status, and cancellations",
        imageUrl: AGENT_IMAGE,
        imageAlt: "Fly Cham customer support",
      },
      ar: {
        title: "تواصل معنا",
        label: "الاستفسارات العامة",
        phoneDisplay: "+963 -11-2122222",
        phoneHref: "tel:+963112122222",
        hours: "خط دعم الزبائن: مفتوح من 9 صباحاً حتى 9 مساءً",
        note: "احصل على المساعدة من فريق خدمة الزبائن بخصوص حجوزاتك، وحالة الرحلات، وجميع استفساراتك.",
        imageUrl: AGENT_IMAGE,
        imageAlt: "دعم زبائن فلاي شام",
      },
    },
  },
  {
    sectionId: "promo-banner",
    content: {
      en: {
        title: "Check your flight status",
        description:
          "Track departures, arrivals, and gate updates in real-time — anytime, anywhere.",
        buttonLabel: "Check status",
        buttonHref: "",
        buttonLinkType: "external",
        imageUrl: FLIGHT_IMAGE,
        imageAlt: "Airport terminal and aircraft at the gate",
      },
      ar: {
        title: "تحقق من حالة رحلتك",
        description:
          "تابع المغادرات والوصولات وتحديثات البوابات في الوقت الفعلي — في أي وقت ومن أي مكان.",
        buttonLabel: "تحقق من الحالة",
        buttonHref: "",
        buttonLinkType: "external",
        imageUrl: FLIGHT_IMAGE,
        imageAlt: "صالة المطار والطائرات عند البوابات",
      },
    },
  },
];
