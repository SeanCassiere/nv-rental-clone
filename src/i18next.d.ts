import {
  formatNsResources,
  i18nextNsDashboard,
  i18nextNsDefault,
  i18nextNsFormat,
  i18nextNsLabels,
  i18nextNsMessages,
  i18nextNsSettings,
  i18nextNsTranslation,
} from "@/lib/config/i18next";

import enDashboard from "../public/locales/en/dashboard.json";
import enLabels from "../public/locales/en/labels.json";
import enMessages from "../public/locales/en/messages.json";
import enSettings from "../public/locales/en/settings.json";
import enTranslation from "../public/locales/en/translation.json";

const resources = {
  [i18nextNsFormat]: formatNsResources,
  [i18nextNsDashboard]: enDashboard,
  [i18nextNsTranslation]: enTranslation,
  [i18nextNsSettings]: enSettings,
  [i18nextNsMessages]: enMessages,
  [i18nextNsLabels]: enLabels,
};

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof i18nextNsDefault;
    resources: typeof resources;
  }
}
