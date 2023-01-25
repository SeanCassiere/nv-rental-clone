import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { format as dateFnsFormat, type Locale } from "date-fns";
import { enUS, enNZ, ru } from "date-fns/locale";

const fnsLocales: Record<string, Locale> = {
  "en-US": enUS,
  "en-NZ": enNZ,
  ru: ru,
};

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
      format: (value, i18nFormat, lng, options) => {
        if (i18nFormat === "datetime") {
          const locale = lng && fnsLocales[lng] ? fnsLocales[lng] : enUS;
          try {
            return dateFnsFormat(new Date(value), "dd/MM/yyyy hh:mm a", {
              locale,
            });
          } catch (error) {
            return "could not parse for intlDateTime";
          }
        }

        if (i18nFormat === "monthyear") {
          try {
            const locale = lng && fnsLocales[lng] ? fnsLocales[lng] : enUS;
            return dateFnsFormat(new Date(value), "MM/yyyy", { locale });
          } catch (error) {
            return "could not parse for intlMonthYear";
          }
        }

        if (i18nFormat === "date") {
          try {
            const locale = lng && fnsLocales[lng] ? fnsLocales[lng] : enUS;
            return dateFnsFormat(new Date(value), "dd/MM/yyyy", { locale });
          } catch (error) {
            return "could not parse for intlDate";
          }
        }

        if (i18nFormat === "currency") {
          const { currency, value: numberValue = 0 } = options as any;

          if (currency !== "" && currency) {
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
