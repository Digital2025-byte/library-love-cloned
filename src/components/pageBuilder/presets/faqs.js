/**
 * FAQs page (/help/faqs).
 *   page-hero        → faq hero (no image)
 *   search-console   → faq search
 *   faq-explorer     → multi-category FAQ (no browse button)
 *   help-categories  → "Get Help" (2 cards)
 *   live-chat-banner → live chat
 */
import { FAQ_CATEGORIES } from "./faqExplorerData";

/** Full FAQ taxonomy (14 categories, 158 Qs) mapped to FaqExplorer content. */
function buildFaqCategories(lang) {
  return FAQ_CATEGORIES.map((cat) => ({
    label: cat.label[lang],
    questions: cat.questions.map((q) => ({
      question: q[lang].question,
      answer: q[lang].answer,
    })),
  }));
}

export const faqsBlocks = [
  {
    sectionId: "page-hero",
    style: { showImage: false },
    content: {
      en: {
        title: "Frequently Asked Questions",
        subtitle: "Find quick answers to the most common questions",
        imageUrl: "",
        imageAlt: "",
      },
      ar: {
        title: "الأسئلة الشائعة",
        subtitle: "اعثر على إجابات سريعة لأكثر الأسئلة شيوعاً",
        imageUrl: "",
        imageAlt: "",
      },
    },
  },
  {
    sectionId: "search-console",
    style: { showSubmit: false },
    content: {
      en: {
        label: "Ask Your Question",
        placeholder: "Search for a topic or question...",
        submitLabel: "",
        popularLabel: "Popular search",
        popularItems: [
          { label: "Baggage" },
          { label: "Booking online" },
          { label: "Check-in" },
          { label: "Flight Status" },
        ],
      },
      ar: {
        label: "اطرح سؤالك",
        placeholder: "ابحث عن موضوع أو سؤال...",
        submitLabel: "",
        popularLabel: "عمليات البحث الشائعة",
        popularItems: [
          { label: "الأمتعة" },
          { label: "الحجز عبر الإنترنت" },
          { label: "تسجيل الوصول" },
          { label: "حالة الرحلة" },
        ],
      },
    },
  },
  {
    sectionId: "faq-explorer",
    style: { showBrowse: false, showTitle: false },
    content: {
      en: {
        title: "",
        browseLabel: "",
        browseHref: "",
        browseLinkType: "internal",
        categories: buildFaqCategories("en"),
      },
      ar: {
        title: "",
        browseLabel: "",
        browseHref: "",
        browseLinkType: "internal",
        categories: buildFaqCategories("ar"),
      },
    },
  },
  {
    sectionId: "contact-cards",
    style: {
      variant: "getHelp",
      columns: "2",
      titleFontWeight: "semibold",
      cardTitleFontWeight: "semibold",
      cardDescriptionColor: "800",
    },
    content: {
      en: {
        title: "Get Help",
        subtitle: "You can get support and assistance wherever you are.",
        cards: [
          { icon: "headset", title: "Customer Care", description: "Contact our Customer Care team for urgent assistance with bookings, flight status, and cancellations.", href: "/help/contact-us" },
          { icon: "clipboard", title: "Forms and Requests", description: "Submit a request, service request, complaint, or feedback.", href: "/help/contact-us/forms" },
        ],
      },
      ar: {
        title: "احصل على المساعدة",
        subtitle: "يمكنك الحصول على الدعم والمساعدة في أي وقت.",
        cards: [
          { icon: "headset", title: "خدمة الزبائن", description: "تواصل مع فريق خدمة الزبائن للحصول على مساعدة فورية بخصوص الحجوزات، وحالة الرحلات، والإلغاءات.", href: "/help/contact-us" },
          { icon: "clipboard", title: "النماذج والطلبات", description: "يمكنك تقديم طلب استرداد، أو طلب خدمة، أو ملاحظة أو مشاركة رأيك في خدماتنا.", href: "/help/contact-us/forms" },
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
];
