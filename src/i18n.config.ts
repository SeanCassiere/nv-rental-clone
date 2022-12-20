import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const common = "common";

// Using language codes from https://github.com/ladjs/i18n-locales
const en = "en";
const languagesCore = [common, en];
const languagesExtensions: string[] = []; // i.e: "en-GB", "en-US", etc...
export const supportedLanguages = [
  ...languagesCore,
  ...languagesExtensions,
].filter((l) => l !== common);

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: (code) => {
      let langsToUse = [common];
      let foundLang = false;

      for (const coreLang of languagesCore.filter((l) => l !== common)) {
        if (code && String(code).startsWith(`${coreLang}-`)) {
          langsToUse = [coreLang, ...langsToUse];
          foundLang = true;
          break;
        }
      }
      if (!foundLang) {
        langsToUse = [en, ...langsToUse];
      }
      return langsToUse;
    },
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

export default i18n;
