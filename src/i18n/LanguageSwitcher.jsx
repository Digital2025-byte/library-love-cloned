"use client";

import { useTranslation } from "react-i18next";
import { languages } from "./settings";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {languages.map((language) => {
        const isActive = i18n.language === language;

        return (
          <button
            key={language}
            type="button"
            onClick={() => i18n.changeLanguage(language)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-1 text-white"
                : "bg-background text-700 hover:bg-100"
            }`}
          >
            {t(`language.${language}`)}
          </button>
        );
      })}
    </div>
  );
}
