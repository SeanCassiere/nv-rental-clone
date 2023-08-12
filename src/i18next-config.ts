import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import type { Locale } from "date-fns";
import dateFnsFormat from "date-fns/format";
import enUSLocale from "date-fns/locale/en-US";
import enNZLocale from "date-fns/locale/en-NZ";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";

import { getAuthToken } from "./utils/authLocal";
import { getLocalStorageForUser } from "./utils/user-local-storage";
import { USER_STORAGE_KEYS, IS_LOCAL_DEV } from "./utils/constants";

// START: date-fns formats
export const dfnsTimeFormat = "hh:mm a";
export const dfnsDateFormat = "dd/MM/yyyy";
// END: date-fns formats

// START: locales for date-fns
const dateFnsLocales: Record<string, Locale> = {
  en: enLocale,
  "en-US": enUSLocale,
  "en-NZ": enNZLocale,
  ru: ruLocale,
};

export function getDateFnsLocale(lng?: string) {
  if (lng && dateFnsLocales[lng]) return dateFnsLocales[lng];
  return enUSLocale;
}
// END: locales for date-fns

export const i18nextNsTranslation = "translation";
export const i18nextNsFormat = "format"; // do not add this to the list of namespaces to prevent a network fetch

export const i18nextNsDefault = i18nextNsTranslation;
export const formatNsResources = {
  intlCurrency: "{{value, currency}}",
  intlDateTime: "{{value, datetime}}",
  intlDate: "{{value, date}}",
  intlMonthYear: "{{value, monthyear}}",
};

// Using language codes from https://github.com/ladjs/i18n-locales
const en = "en";
const languagesCore = [en];
const languagesExtensions = ["en-US"]; // i.e: "en-GB", "en-US", etc...
export const supportedLanguages = [...languagesCore, ...languagesExtensions];

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: (code) => {
      let langsToUse: string[] = [];
      let foundLang = false;

      for (const coreLang of languagesCore) {
        if (code && String(code).startsWith(`${coreLang}-`)) {
          langsToUse = [...langsToUse, coreLang, code];
          foundLang = true;
          break;
        }
      }

      if (!foundLang) {
        langsToUse = [...langsToUse, en];
      }

      return langsToUse;
    },
    interpolation: {
      escapeValue: false,
      format: (value, i18nFormat, lng, options) => {
        if (i18nFormat === "datetime") {
          const auth = getAuthToken();
          const clientId = auth?.profile.navotar_clientid;
          const userId = auth?.profile.navotar_userid;

          const dateFormat =
            getLocalStorageForUser(
              clientId ?? "",
              userId ?? "",
              USER_STORAGE_KEYS.dateFormat
            ) || dfnsDateFormat;
          const timeFormat =
            getLocalStorageForUser(
              clientId ?? "",
              userId ?? "",
              USER_STORAGE_KEYS.timeFormat
            ) || dfnsTimeFormat;
          const dfnsDateFormatWithTime = `${dateFormat} ${timeFormat}`;

          try {
            return dateFnsFormat(new Date(value), dfnsDateFormatWithTime, {
              locale: getDateFnsLocale(lng),
            });
          } catch (error) {
            return "intlDateTime";
          }
        }

        if (i18nFormat === "monthyear") {
          try {
            return dateFnsFormat(new Date(value), "MM/yyyy", {
              locale: getDateFnsLocale(lng),
            });
          } catch (error) {
            return "intlMonthYear";
          }
        }

        if (i18nFormat === "date") {
          const auth = getAuthToken();
          const clientId = auth?.profile.navotar_clientid;
          const userId = auth?.profile.navotar_userid;

          const dateFormat =
            getLocalStorageForUser(
              clientId ?? "",
              userId ?? "",
              USER_STORAGE_KEYS.dateFormat
            ) || dfnsDateFormat;
          try {
            return dateFnsFormat(new Date(value), dateFormat, {
              locale: getDateFnsLocale(lng),
            });
          } catch (error) {
            return "intlDate";
          }
        }

        if (i18nFormat === "currency") {
          const { value: numberValue = 0, digits = 2 } = options as any;

          const auth = getAuthToken();
          const clientId = auth?.profile.navotar_clientid;
          const userId = auth?.profile.navotar_userid;

          const currency =
            getLocalStorageForUser(
              clientId ?? "",
              userId ?? "",
              USER_STORAGE_KEYS.currency
            ) ?? "USD";

          if (currency !== "" && currency) {
            return new Intl.NumberFormat(lng, {
              style: "currency",
              currency,
              minimumFractionDigits: digits,
              maximumFractionDigits: digits,
            }).format(numberValue);
          } else {
            return "intlCurrency";
          }
        }

        return value;
      },
    },
    debug: IS_LOCAL_DEV,
    defaultNS: i18nextNsDefault,
    ns: [i18nextNsTranslation],
    partialBundledLanguages: true,
    resources: {},
  });

for (const lang of supportedLanguages) {
  i18next.addResourceBundle(lang, i18nextNsFormat, formatNsResources);
}

export default i18next;
