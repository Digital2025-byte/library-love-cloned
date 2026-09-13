export const languages = ["en", "ar"];
export const defaultLanguage = "en";
export const rtlLanguages = ["ar"];

export function isRtl(language) {
  return rtlLanguages.includes(language);
}
