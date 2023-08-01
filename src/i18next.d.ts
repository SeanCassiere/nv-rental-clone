import {
  i18nextNsDefault,
  i18nextNsTranslation,
  i18nextNsFormat,
  formatNsResources,
} from "./i18next-config";

import enTranslation from "../public/locales/en/translation.json";

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
