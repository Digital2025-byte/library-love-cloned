/**
 * Our GSA page (/help/contact-us/our-gsa).
 *   page-hero          → gsa hero
 *   location-directory → country tabs + agent cards
 *   cta-banner         → become-a-partner promo
 *   faq-explorer       → gsa FAQs + browse button
 *
 * Agent names/addresses are real proper nouns, kept identical across languages;
 * only the country tab labels are localized.
 */
const HERO_IMAGE = "/help/our-gsa/ph1.png";
const HERO_MASK = "/help/contact-us/mask.png";
const PARTNER_IMAGE = "/help/our-gsa/ph2.png";

// Full source GSA network: 9 countries, 13 agents (both languages).
const COUNTRIES = [
  { id: "armenia", en: "Armenia", ar: "أرمينيا" },
  { id: "iraq", en: "Iraq", ar: "العراق" },
  { id: "kuwait", en: "Kuwait", ar: "الكويت" },
  { id: "libya", en: "Libya", ar: "ليبيا" },
  { id: "oman", en: "Oman", ar: "عُمان" },
  { id: "pakistan", en: "Pakistan", ar: "الباكستان" },
  { id: "sudan", en: "Sudan", ar: "السودان" },
  { id: "turkey", en: "Türkiye", ar: "تركيا" },
  { id: "uae", en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
];

const AGENTS = [
  { country: "armenia", phone: "+374 11202015", email: "wingstourarm@gmail.com", lat: 40.1772, lng: 44.5035,
    en: { name: "Wings Tour", city: "Yerevan", address: "3 Yeznik Koghbatsi Street", hours: "Mon–Fri: 10:00 AM - 06:00 PM · Sat–Sun: Weekend" },
    ar: { name: "Wings Tour", city: "يريفان", address: "3 Yeznik Koghbatsi Street", hours: "الإثنين – الجمعة: 10:00 ص - 06:00 م · السبت – الأحد: العطلة الأسبوعية" } },
  { country: "iraq", phone: "+964 7707962651", email: "sales@flycham-iq.com", lat: 33.324, lng: 44.4156,
    en: { name: "FLY CHAM", city: "Baghdad", address: "Saadoon Street", hours: "Mon–Thu: 09:30 AM - 03:30 PM · Fri: Weekend · Sat–Sun: 09:30 AM - 03:30 PM" },
    ar: { name: "فلاي شام", city: "بغداد", address: "شارع السعدون", hours: "الإثنين – الخميس: 09:30 ص - 03:30 م · الجمعة: العطلة الأسبوعية · السبت – الأحد: 09:30 ص - 03:30 م" } },
  { country: "iraq", phone: "+964 7730500070", email: "fly.alrafidainco@yahoo.com", lat: 30.5152, lng: 47.7835,
    en: { name: "Al-Rafidin Company", city: "Basrah", address: "14 Tammoz St., Near Basra's International Hotel", hours: "Mon–Sun: 09:00 AM - 09:00 PM · Fri-Sat: Weekend" },
    ar: { name: "شركة الرافدين", city: "البصرة", address: "14 شارع تموز – جانب فندق البصرة الدولي", hours: "الإثنين – الأحد: 09:00 ص - 09:00 م · الجمعة - السبت: العطلة الأسبوعية" } },
  { country: "iraq", phone: "+964 7501000405", email: "flycham@zozik-air.net", lat: 36.1911, lng: 44.0094,
    en: { name: "Zozik Aviation", city: "Erbil", address: "Gullan Street, English Village Road, Behind Costa Rica Cafe", hours: "Mon–Thu: 09:30 AM - 02:00 PM · Fri: Weekend · Sat–Sun: 09:30 AM - 02:00 PM" },
    ar: { name: "Zozik Aviation", city: "أربيل", address: "Gullan Street - English Village Road- Behind Costa Rica Cafe", hours: "الإثنين – الخميس: 09:30 ص - 02:00 م · الجمعة: العطلة الأسبوعية · السبت – الأحد: 09:30 ص - 02:00 م" } },
  { country: "iraq", phone: "+964 7810615819", email: "fly.alrafidainco@yahoo.com", lat: 32.0256, lng: 44.346,
    en: { name: "Al-Rafidin Company", city: "Al Najaf", address: "Al-Rafidain Building, Muthanna St., Opposite Of Zain Company", hours: "Mon–Sun: 09:00 AM - 10:00 PM · Fri-Sat: Weekend" },
    ar: { name: "شركة الرافدين", city: "النجف", address: "شارع المثنى – مقابل شركة زين", hours: "الإثنين – الأحد: 09:00 ص - 10:00 م · الجمعة - السبت: العطلة الأسبوعية" } },
  { country: "kuwait", phone: "+965 22444434", email: "operations@malektravel.com", lat: 29.3721, lng: 47.9748,
    en: { name: "Malek Travel & Tourism", city: "Kuwait", address: "Al Qibla, Ali Salem Street, Al Thuwaini Building, Next To The Fire Service Directorate", hours: "Mon–Thu: 08:30 AM - 09:00 PM · Fri: Weekend · Sat–Sun: 08:30 AM - 09:00 PM" },
    ar: { name: "مالك للسياحة و السفر", city: "الكويت", address: "القبلة - شارع علي السالم - عمارة الثويني - بجانب الإدارة العامة للإطفاء", hours: "الإثنين – الخميس: 08:30 ص - 09:00 م · الجمعة: العطلة الأسبوعية · السبت – الأحد: 08:30 ص - 09:00 م" } },
  { country: "libya", phone: "+218 935940176", email: "libya.gsa@flycham.com", lat: 32.8872, lng: 13.1913,
    en: { name: "Amman Star for Tourism and Travel", city: "Tripoli", address: "Omar Al-Mukhtar Complex Office No. 49", hours: "Mon–Thu: 09:00 AM - 05:00 PM · Fri: Weekend · Sat–Sun: 09:00 AM - 05:00 PM" },
    ar: { name: "نجمة عمان للسياحة والسفر", city: "طرابلس", address: "مجمع عمر المختار مكتب رقم 49", hours: "الإثنين – الخميس: 09:00 ص - 05:00 م · الجمعة: العطلة الأسبوعية · السبت – الأحد: 09:00 ص - 05:00 م" } },
  { country: "oman", phone: "+968 71113247", email: "sales.oman@flycham.com", lat: 23.599, lng: 58.4308,
    en: { name: "Jasmine Wings", city: "Muscat", address: "Muscat-Al Khuwair North -Ministries District Roundabout-A’Raya Complex -Ground Floor -Office G02", hours: "Mon–Thu: 09:00 AM - 05:00 PM · Fri–Sat: Weekend · Sun: 09:00 AM - 05:00 PM" },
    ar: { name: "أجنحة الياسمين", city: "مسقط", address: "مسقط -الخوير الشمالية -دوار الوزارات -مجمع الراية -الطابق الأرضي -مكتب ٢", hours: "الإثنين – الخميس: 09:00 ص - 05:00 م · الجمعة – السبت: العطلة الأسبوعية · الأحد: 09:00 ص - 05:00 م" } },
  { country: "pakistan", phone: "+92 2135623305", email: "info@quantumaviation.aero", lat: 24.8475, lng: 67.0308,
    en: { name: "Quantum Aviation (Pvt.) Ltd", city: "Karachi", address: "U-1 Ground Floor, Trade Tower Opposite Services Mess Abdullah Haroon Road, Karachi-Pakistan", hours: "Mon–Sat: 09:00 AM – 05:00 PM · Sun: Weekend" },
    ar: { name: "شركة كوانتوم للطيران (الخاصة) المحدودة", city: "كراتشي", address: "U-1 Ground Floor, Trade Tower Opposite Services Mess Abdullah Haroon Road, Karachi-Pakistan", hours: "الإثنين – السبت: 09:00 ص - 05:00 م · الأحد: العطلة الأسبوعية" } },
  { country: "pakistan", phone: "+92 4235751651", email: "info@quantumaviation.aero", lat: 31.5104, lng: 74.3444,
    en: { name: "Quantum Aviation (Pvt.) Ltd", city: "Lahore", address: "4-Ug Al-Hafeez Heights 65-D, Gulberg-3 Lahore-Pakistan", hours: "Mon–Sat: 09:00 AM – 05:00 PM · Sun: Weekend" },
    ar: { name: "شركة كوانتوم للطيران (الخاصة) المحدودة", city: "لاهور", address: "4-Ug Al-Hafeez Heights 65-D, Gulberg-3 Lahore-Pakistan", hours: "الاثنين – السبت: 09:00 ص - 05:00 م · الأحد: العطلة الأسبوعية" } },
  { country: "sudan", phone: "+249 183746859", email: "naga@sabratravel-sd.com", lat: 15.5933, lng: 32.5342,
    en: { name: "Sabra Two Tours", city: "Khartoum", address: "17 Mc Nimir St, Intersection Of Mc Nimir St & Baladia St", hours: "Mon–Thu: 09:00 AM - 04:30 PM · Fri–Sat: Weekend · Sun: 09:00 AM - 04:30 PM" },
    ar: { name: "صبرا تو تورز", city: "الخرطوم", address: "١٧ شارع المك نمر تقاطع المك نمر مع البلدية", hours: "الإثنين – الخميس: 09:00 ص - 04:30 م · الجمعة – السبت: العطلة الأسبوعية · الأحد: 09:00 ص - 04:30 م" } },
  { country: "turkey", phone: "+90 5467609322", email: "sales.turkey@flycham.com", lat: 41.0486, lng: 28.9872,
    en: { name: "Goknar Turizm", city: "Istanbul", address: "Ergenekon Mah. Halaskargazi Cad. No: 11 Daire No: 2 Şişli/ İstanbul", hours: "Mon–Fri: 09:00 AM - 05:00 PM · Sat–Sun: Weekend" },
    ar: { name: "غوكنار توريزم", city: "إسطنبول", address: "Ergenekon Mah. Halaskargazi Cad. No: 11 Daire No: 2 Şişli/ İstanbul", hours: "الإثنين – الجمعة: 09:00 ص - 05:00 م · السبت – الأحد: العطلة الأسبوعية" } },
  { country: "uae", phone: "+971 42222777", email: "info@flyandmore.com", lat: 25.2532, lng: 55.3331,
    en: { name: "Fly & More Travel", city: "Dubai", address: "Office 110, Zeenah Bldg, Port Saeed, Dubai, UAE", hours: "Mon–Sun: 09:00 AM - 07:00 PM · Fri-Sat: Weekend" },
    ar: { name: "فلاي آند مور", city: "دبي", address: "دبي – ديرة - ميناء سعيد - بناء زينة - مكتب رقم 110", hours: "الإثنين – الأحد: 09:00 ص - 07:00 م · الجمعة - السبت: العطلة الأسبوعية" } },
];

/** One tab per country; each agent card is localized by `lang`. */
function buildAgentTabs(lang) {
  return COUNTRIES.map((c) => ({
    label: c[lang],
    locations: AGENTS.filter((a) => a.country === c.id).map((a) => ({
      name: a[lang].name,
      city: a[lang].city,
      address: a[lang].address,
      phone: a.phone,
      email: a.email,
      hours: a[lang].hours,
      lat: a.lat,
      lng: a.lng,
    })),
  }));
}

export const ourGsaBlocks = [
  {
    sectionId: "page-hero",
    content: {
      en: {
        title: "Our GSA",
        subtitle: "Find and connect with our authorized General Sales Agents",
        imageUrl: HERO_IMAGE,
        imageMask: HERO_MASK,
        imageAlt: "Airport lounge overlooking the airfield",
      },
      ar: {
        title: "وكلاؤنا",
        subtitle: "اعثر على وكلاء المبيعات العامة المعتمدين وتواصل معهم",
        imageUrl: HERO_IMAGE,
        imageMask: HERO_MASK,
        imageAlt: "صالة المطار المطلة على ساحة المطار",
      },
    },
  },
  {
    sectionId: "location-directory",
    style: { showMap: true, mapSide: "right" },
    content: {
      en: {
        title: "Our GSA (General Sales Agents)",
        subtitle: "",
        tabs: buildAgentTabs("en"),
      },
      ar: {
        title: "وكلاؤنا (وكلاء المبيعات العامة)",
        subtitle: "",
        tabs: buildAgentTabs("ar"),
      },
    },
  },
  {
    sectionId: "promo-banner",
    content: {
      en: {
        title: "Become a partner",
        description:
          "Join our partners' network and become our official regional representative. Complete the application form to initiate our commercial vetting process.",
        buttonLabel: "Start application",
        buttonHref: "",
        buttonLinkType: "external",
        imageUrl: PARTNER_IMAGE,
        imageAlt: "Fly Cham aircraft in flight",
      },
      ar: {
        title: "كن شريكاً",
        description:
          "انضم إلى شبكة شركائنا وكن ممثلنا الإقليمي الرسمي. أكمل نموذج التقديم لبدء عملية التقييم التجاري.",
        buttonLabel: "ابدأ التقديم",
        buttonHref: "",
        buttonLinkType: "external",
        imageUrl: PARTNER_IMAGE,
        imageAlt: "طائرة فلاي شام في الجو",
      },
    },
  },
  {
    sectionId: "faq-explorer",
    content: {
      en: {
        title: "Frequently Asked Questions",
        browseLabel: "Browse FAQs",
        browseHref: "/help/faqs",
        browseLinkType: "internal",
        categories: [
          {
            label: "Partners",
            questions: [
              { question: "How can I contact Fly Cham for Travel Agency or OTA support?", answer: "Contact our partner support team through the application form or Customer Care. They will route Travel Agency and OTA inquiries to the right commercial team." },
              { question: "Are there any setup fees to join Fly Cham partner networks?", answer: "Setup fees depend on the partnership type and market. Details are shared during the commercial vetting process after you submit your application." },
              { question: "What compliance documents are needed for approval?", answer: "Typical requirements include a valid trade license, tax registration, and authorized signatory documents. The partner team will confirm the full list for your country." },
              { question: "How do I access API integration as a new OTA partner?", answer: "After your partner account is approved, the integrations team will share API credentials, documentation, and a sandbox environment for testing." },
            ],
          },
        ],
      },
      ar: {
        title: "الأسئلة الشائعة",
        browseLabel: "تصفّح الأسئلة الشائعة",
        browseHref: "/help/faqs",
        browseLinkType: "internal",
        categories: [
          {
            label: "الشركاء",
            questions: [
              { question: "كيف يمكنني التواصل مع فلاي شام لدعم وكالات السفر أو وكالات السفر الإلكترونية؟", answer: "تواصل مع فريق دعم الشركاء عبر نموذج التقديم أو خدمة الزبائن، وسيتم توجيه الاستفسارات إلى الفريق التجاري المختص." },
              { question: "هل هناك رسوم إعداد للانضمام إلى شبكات شركاء فلاي شام؟", answer: "تختلف رسوم الإعداد حسب نوع الشراكة والسوق. يتم توضيح التفاصيل خلال عملية التقييم التجاري بعد تقديم طلبك." },
              { question: "ما هي وثائق الامتثال المطلوبة للموافقة؟", answer: "عادةً ما يُطلب ترخيص تجاري ساري، وتسجيل ضريبي، ووثائق المفوض بالتوقيع. يؤكد فريق الشركاء القائمة الكاملة حسب بلدك." },
              { question: "كيف أصل إلى تكامل واجهة البرمجة كشريك وكالة إلكترونية جديد؟", answer: "بعد الموافقة على حساب الشريك، يزوّدك فريق التكامل ببيانات الواجهة والوثائق وبيئة تجريبية للاختبار." },
            ],
          },
        ],
      },
    },
  },
];
