import { i18nDefaultNs, commonFormatNamespace } from "./i18next-config";

import enTranslation from "../public/locales/en/translation.json";

const resources = {
  format: commonFormatNamespace,
  translation: enTranslation,
};

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof i18nDefaultNs;
    resources: typeof resources;
  }
}
