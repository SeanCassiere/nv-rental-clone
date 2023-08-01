import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import dateFnsFormat from "date-fns/format";
import { type Locale } from "date-fns";

import enUSLocale from "date-fns/locale/en-US";
import enNZLocal from "date-fns/locale/en-NZ";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";

import { getAuthToken } from "./utils/authLocal";
import { getLocalStorageForUser } from "./utils/user-local-storage";
import { OIDC_REDIRECT_URI } from "./utils/constants";

export const dfnsTimeFormat = "hh:mm a";
export const dfnsDateFormat = "dd/MM/yyyy";

const dateFnsLocales: Record<string, Locale> = {
  en: enLocale,
  "en-US": enUSLocale,
  "en-NZ": enNZLocal,
  ru: ruLocale,
};
export function getDateFnsLocale(lng?: string) {
  if (lng && dateFnsLocales[lng]) return dateFnsLocales[lng];
  return enUSLocale;
}

const common = "common";
export const commonFormatNamespace = {
  intlCurrency: "{{value, currency}}",
  intlDateTime: "{{value, datetime}}",
  intlDate: "{{value, date}}",
  intlMonthYear: "{{value, monthyear}}",
};

// Using language codes from https://github.com/ladjs/i18n-locales
const en = "en";
const languagesCore = [common, en];
const languagesExtensions: string[] = []; // i.e: "en-GB", "en-US", etc...
export const supportedLanguages = [
  ...languagesCore,
  ...languagesExtensions,
].filter((l) => l !== common);

export const i18nDefaultNs = "translation";

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
              "date-format"
            ) || dfnsDateFormat;
          const timeFormat =
            getLocalStorageForUser(
              clientId ?? "",
              userId ?? "",
              "time-format"
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
              "date-format"
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
          const {
            currency = "USD",
            value: numberValue = 0,
            digits = 2,
          } = options as any;

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
    debug: OIDC_REDIRECT_URI.startsWith("http://"),
    defaultNS: i18nDefaultNs,
    ns: ["format", "translation"],
    partialBundledLanguages: true,
    resources: {},
  });

i18n.addResourceBundle(common, "format", commonFormatNamespace);

export default i18n;
