import type { Locale } from "date-fns";
import dateFnsFormat from "date-fns/format";
import enNZLocale from "date-fns/locale/en-NZ";
import enUSLocale from "date-fns/locale/en-US";
import enLocale from "date-fns/locale/en-US";
import ruLocale from "date-fns/locale/ru";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { getAuthToken } from "./utils/authLocal";
import { IS_LOCAL_DEV, USER_STORAGE_KEYS } from "./utils/constants";
import { getLocalStorageForUser } from "./utils/user-local-storage";

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
export const i18nextNsSettings = "settings";
export const i18nextNsDashboard = "dashboard";
export const i18nextNsMessages = "messages";
export const i18nextNsLabels = "labels";
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
            console.error("error at i18next.t('intlDateTime')", error);
            return "intlDateTime";
          }
        }

        if (i18nFormat === "monthyear") {
          try {
            return dateFnsFormat(new Date(value), "MM/yyyy", {
              locale: getDateFnsLocale(lng),
            });
          } catch (error) {
            console.error("error at i18next.t('intlMonthYear')", error);
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
            console.error("error at i18next.t('intlDate')", error);
            return "intlDate";
          }
        }

        if (i18nFormat === "currency") {
          const { value: numberValue = 0, digits } = options as any;

          const auth = getAuthToken();
          const clientId = auth?.profile.navotar_clientid;
          const userId = auth?.profile.navotar_userid;

          const digitsCountFromLocal = getLocalStorageForUser(
            clientId ?? "",
            userId ?? "",
            USER_STORAGE_KEYS.currencyDigits
          );

          const digitsCountParsed = parseInt(digitsCountFromLocal ?? "2", 10);
          const digitsToShow =
            typeof digits !== "undefined"
              ? typeof digits === "number"
                ? digits
                : parseInt(digits, 10)
              : digitsCountParsed;

          const currency =
            getLocalStorageForUser(
              clientId ?? "",
              userId ?? "",
              USER_STORAGE_KEYS.currency
            ) ?? "USD";

          try {
            if (currency !== "" && currency) {
              return new Intl.NumberFormat(lng, {
                style: "currency",
                currency,
                minimumFractionDigits: digitsToShow,
                maximumFractionDigits: digitsToShow,
              }).format(numberValue);
            } else {
              throw new Error("Currency is not defined");
            }
          } catch (error) {
            console.error("error at i18next.t('intlCurrency')", error);
            return "intlCurrency";
          }
        }

        return value;
      },
    },
    debug: IS_LOCAL_DEV,
    defaultNS: i18nextNsDefault,
    ns: [
      i18nextNsTranslation,
      i18nextNsDashboard,
      i18nextNsSettings,
      i18nextNsMessages,
      i18nextNsLabels,
    ],
    // ns: [],
    partialBundledLanguages: true,
    resources: {},
  });

for (const lang of supportedLanguages) {
  i18next.addResourceBundle(lang, i18nextNsFormat, formatNsResources);
}

export default i18next;
