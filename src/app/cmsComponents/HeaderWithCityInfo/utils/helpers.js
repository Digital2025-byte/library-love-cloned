import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function toCssUrl(url = "") {
  return String(url)
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function formatNextFlightDate(value, lang = "en") {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function getFileUrl(image) {
  if (!image) {
    return "";
  }
  if (typeof image === "string") {
    return image;
  }
  return image.fileUrl || image.url || image.src || "";
}

export function getHeaderWithCityInfoContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      countryName: "",
      weatherTitle: "",
      description: "",
      links: [],
      weather: "",
      localTime: "",
      duration: "",
      numberOfFlightPerWeek: "",
      nextFlight: "",
      nextFlightRaw: "",
      backgroundImage: "",
      imageAlt: "",
      labels: {},
      hasContent: false,
      hasCityCard: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const title = content?.title || "";
  const countryName = content?.countryName || "";
  const weatherTitle = content?.weatherTitle || "";
  const description = content?.description || "";
  const weather = content?.weather || "";
  const localTime = content?.localTime || "";
  const duration = content?.duration || "";
  const numberOfFlightPerWeek = content?.numberOfFlightPerWeek || "";
  const nextFlightRaw = content?.nextFlight || "";
  const backgroundImage = getFileUrl(content?.backgroundImage);
  const imageAlt = content?.backgroundImage?.alt || content?.imageAlt || title || "";
  const labels = content?.labels || {};

  return {
    title,
    countryName,
    weatherTitle,
    description,
    links: normalizeBacklinks(content?.links),
    weather,
    localTime,
    duration,
    numberOfFlightPerWeek,
    nextFlight: formatNextFlightDate(nextFlightRaw, lang) || nextFlightRaw,
    nextFlightRaw,
    backgroundImage: backgroundImage ? toCssUrl(backgroundImage) : "",
    imageAlt,
    labels: {
      weather: labels.weather || (lang === "ar" ? "الطقس:" : "Weather:"),
      localTime:
        labels.localTime || (lang === "ar" ? "الوقت المحلي:" : "Local Time:"),
      flightDuration:
        labels.flightDuration ||
        (lang === "ar" ? "مدة الرحلة:" : "Flight Duration:"),
      flightsPerWeek:
        labels.flightsPerWeek ||
        (lang === "ar" ? "عدد الرحلات في الأسبوع:" : "Flights per week:"),
      nextFlight:
        labels.nextFlight ||
        (lang === "ar" ? "الرحلة التالية:" : "Next Flight:"),
    },
    hasCityCard: Boolean(
      weatherTitle ||
        description ||
        weather ||
        localTime ||
        duration ||
        numberOfFlightPerWeek ||
        nextFlightRaw
    ),
    hasContent: Boolean(title || countryName || weatherTitle || backgroundImage),
  };
}

export function getHeaderWithCityInfoEditorContent(data, lang = "en") {
  const content = getHeaderWithCityInfoContent(data, lang);

  return {
    title: content.title || "",
    countryName: content.countryName || "",
    weatherTitle: content.weatherTitle || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    weather: content.weather || "",
    localTime: content.localTime || "",
    duration: content.duration || "",
    numberOfFlightPerWeek: content.numberOfFlightPerWeek || "",
    nextFlight: content.nextFlightRaw || "",
    imageUrl: content.backgroundImage || "",
    imageAlt: content.imageAlt || "",
    labels: {
      weather: content.labels.weather || "",
      localTime: content.labels.localTime || "",
      flightDuration: content.labels.flightDuration || "",
      flightsPerWeek: content.labels.flightsPerWeek || "",
      nextFlight: content.labels.nextFlight || "",
    },
  };
}

export function wrapHeaderWithCityInfoContent(content = {}, lang = "en") {
  const labels = content.labels || {};

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          countryName: content.countryName || "",
          weatherTitle: content.weatherTitle || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          weather: content.weather || "",
          localTime: content.localTime || "",
          duration: content.duration || "",
          numberOfFlightPerWeek: content.numberOfFlightPerWeek || "",
          nextFlight: content.nextFlight || "",
          imageAlt: content.imageAlt || "",
          labels: {
            weather: labels.weather || "",
            localTime: labels.localTime || "",
            flightDuration: labels.flightDuration || "",
            flightsPerWeek: labels.flightsPerWeek || "",
            nextFlight: labels.nextFlight || "",
          },
          backgroundImage: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || content.title || "",
          },
        },
      },
    ],
  };
}

export function isUsableImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
