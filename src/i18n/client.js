"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLanguage, languages } from "./settings";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: languages,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
