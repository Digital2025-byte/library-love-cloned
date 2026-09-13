/**
 * Forms page (/help/contact-us/forms).
 *   page-hero        → forms hero
 *   search-console   → forms search
 *   forms-directory  → stage tabs + form cards
 *   track-request    → track an existing request
 *   cta-banner       → "Need More Help?" promo
 */
const HERO_IMAGE = "/help/forms/ph1.png";
const HERO_MASK = "/help/contact-us/mask.png";
const GUIDE_IMAGE = "/help/help/ph1.png";

// Stage filters (source forms.filters) — note afterTravel = "Onboard Experience".
const STAGES = [
  { id: "all", en: "All forms", ar: "جميع النماذج" },
  { id: "beforeTravel", en: "Before Travel", ar: "قبل السفر" },
  { id: "atAirport", en: "At the Airport", ar: "في المطار" },
  { id: "afterTravel", en: "Onboard Experience", ar: "تجربة على متن الطائرة" },
  { id: "others", en: "Others", ar: "أخرى" },
];

// The full source forms list (supportForms + forms.items), both languages.
const FORMS = [
  { id: "bookingChange", stage: "beforeTravel", icon: "change",
    en: { title: "Booking Change", description: "Request assistance with changing the date, route, or flight details of an existing booking." },
    ar: { title: "تعديل الحجز", description: "اطلب المساعدة في تعديل تاريخ الرحلة أو مسارها أو تفاصيل حجزك الحالي." } },
  { id: "transportation", stage: "beforeTravel", icon: "transport",
    en: { title: "Transportation", description: "Arrange your transportation to and from the airport and local destination." },
    ar: { title: "خدمة التنقّل", description: "يمكنك طلب خدمة التنقّل من وإلى المطار ومنزلك أو فندقك." } },
  { id: "nameCorrection", stage: "beforeTravel", icon: "name",
    en: { title: "Name Correction", description: "Request a correction to a passenger name when it does not match the passenger’s passport." },
    ar: { title: "تصحيح الاسم", description: "اطلب تصحيح اسم المسافر عندما لا يتطابق الاسم الوارد في الحجز مع الاسم في جواز السفر." } },
  { id: "paymentIssue", stage: "beforeTravel", icon: "payment",
    en: { title: "Payment Issue", description: "Report an unsuccessful payment, pending transaction, or payment confirmation issue." },
    ar: { title: "مشكلة في الدفع", description: "أبلغ عن عملية دفع غير ناجحة أو معلّقة، أو عن مشكلة في تأكيد عملية الدفع." } },
  { id: "unaccompaniedMinor", stage: "beforeTravel", icon: "minor",
    en: { title: "Unaccompanied Minor", description: "Arrange dedicated assistance for an eligible child travelling alone on a Fly Cham flight." },
    ar: { title: "المسافرون الصغار دون مرافق", description: "يمكنك طلب خدمة المسافرين الصغار دون مرافق لطفل مؤهل يسافر بمفرده على متن إحدى رحلاتنا." } },
  { id: "groupTravel", stage: "beforeTravel", icon: "group",
    en: { title: "Group Travel", description: "Request travel arrangements for a group travelling on the same itinerary." },
    ar: { title: "سفر المجموعات", description: "اطلب حجزاً لمجموعة من المسافرين على الرحلة نفسها." } },
  { id: "corporateTravel", stage: "beforeTravel", icon: "corporate",
    en: { title: "Corporate Travel", description: "Ask about travel arrangements for companies or business travelers." },
    ar: { title: "سفر الشركات", description: "اطلب ترتيبات السفر المخصصة للشركات ورجال الأعمال." } },
  { id: "wheelchair", stage: "atAirport", icon: "wheelchair",
    en: { title: "Wheelchair", description: "Request wheelchair assistance at the airport for your upcoming journey." },
    ar: { title: "الكرسي المتحرك", description: "اطلب خدمة الكرسي المتحرك في المطار لرحلتك القادمة." } },
  { id: "oxygenService", stage: "atAirport", icon: "medical",
    en: { title: "Oxygen Service", description: "Request onboard oxygen service, subject to medical requirements and availability." },
    ar: { title: "خدمة الأكسجين", description: "اطلب توفير خدمة الأكسجين على متن الطائرة، وفقاً للشروط الطبية ومدى توفر الخدمة." } },
  { id: "refund", stage: "afterTravel", icon: "refund",
    en: { title: "Refund", description: "Request a refund for an eligible Fly Cham booking." },
    ar: { title: "طلب استرداد", description: "اطلب استرداد قيمة حجزك وفقاً لشروط وأحكام الاسترداد." } },
  { id: "ancillaryRefund", stage: "afterTravel", icon: "ticket",
    en: { title: "Ancillary Service Refund", description: "Request a refund for an eligible seat, baggage, or other additional service." },
    ar: { title: "استرداد رسوم خدمة إضافية", description: "اطلب استرداد رسوم خدمة إضافية، مثل اختيار المقعد أو الأمتعة الإضافية." } },
  { id: "lostBaggage", stage: "afterTravel", icon: "suitcase",
    en: { title: "Lost Baggage/Item Left on Board", description: "Report checked baggage were lost at the airport." },
    ar: { title: "الأمتعة المفقودة", description: "أبلغ عن أمتعة مسجلة أو أمتعة محمولة باليد تمّ فقدانها على متن إحدى رحلاتنا." } },
  { id: "delayedBaggage", stage: "afterTravel", icon: "baggage",
    en: { title: "Delayed Baggage", description: "Report checked baggage that did not arrive with your flight." },
    ar: { title: "الأمتعة المتأخرة", description: "أبلغ عن الأمتعة المسجلة التي لم تصل مع رحلتك." } },
  { id: "claimMiles", stage: "afterTravel", icon: "medal",
    en: { title: "Claim Loyalty Miles", description: "Claim your loyalty miles that are not showing in a Cham Miles account." },
    ar: { title: "المطالبة بأميال الولاء", description: "اطلب إضافة أميال الرحلة التي لم تظهر في حسابك لدى برنامج الولاء شام مايلز." } },
  { id: "feedback", stage: "afterTravel", icon: "feedback",
    en: { title: "Share your Feedback", description: "Tell us about your experience flying with Fly Cham." },
    ar: { title: "شاركنا رأيك", description: "أخبرنا عن تجربتك في السفر مع فلاي شام." } },
  { id: "apiIntegration", stage: "others", icon: "plugs",
    en: { title: "API Integration", description: "Submit your request for API integration to connect as an approved authorized OTA for Fly Cham." },
    ar: { title: "طلب التكامل", description: "قدّم طلباً لربط وكالة السفر الإلكترونية الخاصة بك مع فلاي شام عبر واجهة برمجة التطبيقات." } },
  { id: "partnerGsa", stage: "others", icon: "handshake",
    en: { title: "Partner as GSA", description: "Become a General Sales Agent for Fly Cham in your region." },
    ar: { title: "الانضمام كوكيل مبيعات عام", description: "قدّم طلباً للانضمام إلى شبكة وكلاء فلاي شام لتكون وكيلاً للمبيعات في بلدك." } },
  { id: "cargo", stage: "others", icon: "package",
    en: { title: "Cargo", description: "Submit a request to transport goods or documents with Fly Cham Cargo." },
    ar: { title: "الشحن الجوي", description: "قدّم طلباً لنقل البضائع أو الوثائق عبر خدمات فلاي شام للشحن الجوي." } },
];

function stageLabel(stageId, lang) {
  return (STAGES.find((s) => s.id === stageId) || STAGES[0])[lang];
}

/** One tab per stage; the card's chip is always its own stage label. */
function buildFormTabs(lang) {
  return STAGES.map((stage) => ({
    label: stage[lang],
    cards: FORMS.filter(
      (form) => stage.id === "all" || form.stage === stage.id
    ).map((form) => ({
      icon: form.icon,
      category: stageLabel(form.stage, lang),
      title: form[lang].title,
      description: form[lang].description,
      href: `/help/contact-us/forms/${form.id}/request`,
    })),
  }));
}

export const formsBlocks = [
  {
    sectionId: "page-hero",
    content: {
      en: {
        title: "Forms and Support Requests",
        subtitle:
          "Find the right form and provide complete, accurate details to help us process your request quickly",
        imageUrl: HERO_IMAGE,
        imageMask: HERO_MASK,
        imageAlt: "Hands typing on a laptop and holding a smartphone",
      },
      ar: {
        title: "الاستمارات وطلبات الدعم",
        subtitle:
          "اختر الاستمارة المناسبة مع تقديم كافة التفاصيل لمساعدتنا في معالجة طلبك في أسرع وقت",
        imageUrl: HERO_IMAGE,
        imageMask: HERO_MASK,
        imageAlt: "يدان تكتبان على حاسوب محمول وتمسكان هاتفاً ذكياً",
      },
    },
  },
  {
    sectionId: "search-console",
    style: { showSubmit: false },
    content: {
      en: {
        label: "Ask Your Question",
        placeholder: "Search by form name, keyword, or question",
        submitLabel: "",
        popularLabel: "Popular search",
        popularItems: [
          { label: "Baggage" },
          { label: "Refund" },
          { label: "Payment issue" },
          { label: "Lost baggage" },
        ],
      },
      ar: {
        label: "اطرح سؤالك",
        placeholder: "ابحث باسم الاستمارة أو بكلمة مفتاحية أو سؤال",
        submitLabel: "",
        popularLabel: "عمليات البحث الشائعة",
        popularItems: [
          { label: "الأمتعة" },
          { label: "استرداد" },
          { label: "مشكلة في الدفع" },
          { label: "أمتعة مفقودة" },
        ],
      },
    },
  },
  {
    sectionId: "forms-directory",
    content: {
      en: { title: "All Forms", tabs: buildFormTabs("en") },
      ar: { title: "جميع النماذج", tabs: buildFormTabs("ar") },
    },
  },
  {
    sectionId: "track-request",
    content: {
      en: {
        title: "Track an Existing Request",
        subtitle:
          "Already submitted a form request? Use your case number to check your request status.",
        caseNumberLabel: "Case number *",
        lastNameLabel: "Passenger last name *",
        submitLabel: "Track My Request",
      },
      ar: {
        title: "متابعة طلب سابق",
        subtitle:
          "هل سبق أن قدّمت استمارة طلب؟ استخدم رقم الحالة للتحقق من حالة طلبك.",
        caseNumberLabel: "رقم الحالة *",
        lastNameLabel: "اسم عائلة المسافر *",
        submitLabel: "متابعة طلبي",
      },
    },
  },
  {
    sectionId: "cta-banner",
    content: {
      en: {
        title: "Need More Help?",
        description:
          "Get in touch with our Customer Care team for assistance with your request.",
        buttonLabel: "Contact Us",
        buttonHref: "/help/contact-us",
        buttonLinkType: "internal",
        imageUrl: GUIDE_IMAGE,
        imageAlt: "Fly Cham customer service agent",
      },
      ar: {
        title: "هل تحتاج إلى مزيد من المساعدة؟",
        description:
          "تواصل مع فريق خدمة الزبائن للحصول على المساعدة بشأن طلبك.",
        buttonLabel: "اتصل بنا",
        buttonHref: "/help/contact-us",
        buttonLinkType: "internal",
        imageUrl: GUIDE_IMAGE,
        imageAlt: "موظف خدمة زبائن فلاي شام",
      },
    },
  },
];
