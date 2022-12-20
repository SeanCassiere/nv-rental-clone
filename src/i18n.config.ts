import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import dayjs from "dayjs";

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
      format: (value, format, lng, options) => {
        if (format === "datetime") {
          return dayjs(value, { locale: lng }).format("DD/MM/YYYY hh:mm A");
        }

        if (format === "date") {
          return dayjs(value, { locale: lng }).format("DD/MM/YYYY");
        }
        if (format === "currency") {
          const { currency, value: numberValue = 0 } = options as any;

          if (currency !== "") {
            return new Intl.NumberFormat(lng, {
              style: "currency",
              currency,
            }).format(numberValue);
          }
        }

        return value;
      },
    },
    debug: false,
  });

export default i18n;
