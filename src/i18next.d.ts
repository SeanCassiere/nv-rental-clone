import enTranslation from "../public/locales/en/translation.json";
import {
  formatNsResources,
  i18nextNsDefault,
  i18nextNsFormat,
  i18nextNsTranslation,
} from "./i18next-config";

const resources = {
  [i18nextNsFormat]: formatNsResources,
  [i18nextNsTranslation]: enTranslation,
};

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof i18nextNsDefault;
    resources: typeof resources;
  }
}
