"use client";

import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./client";
import { isRtl } from "./settings";

function DocumentLangSync({ children }) {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    const language = i18nInstance.language?.startsWith("ar") ? "ar" : "en";
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl(language) ? "rtl" : "ltr";
  }, [i18nInstance.language]);

  return children;
}

export default function I18nProvider({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <DocumentLangSync>{children}</DocumentLangSync>
    </I18nextProvider>
  );
}
