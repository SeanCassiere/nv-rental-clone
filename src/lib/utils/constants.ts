export const LS_OIDC_REDIRECT_URI_KEY = "oidc:redirect_uri" as const;

export const apiBaseUrl = import.meta.env.VITE_APP_API_URI
  ? `${import.meta.env.VITE_APP_API_URI}/api`
  : "https://testapi.appnavotar.com/api";

export const STORAGE_KEYS = {
  theme: "theme",
  dateFormat: "app-runtime:date-format",
  timeFormat: "app-runtime:time-format",
  dismissedMessages: "app-runtime:dismissed-messages",
  tableRowCount: "app-runtime:table-row-count",
  currency: "app-runtime:currency",
  currencyDigits: "app-runtime:currency-digits",
} as const;

export const STORAGE_DEFAULTS = {
  tableRowCount: "10",
  currencyDigits: "2",
  theme: "system" as const,
};

export const OIDC_AUTHORITY =
  import.meta.env.VITE_APP_AUTH_AUTHORITY || "https://testauth.appnavotar.com";
export const OIDC_CLIENT_ID =
  import.meta.env.VITE_APP_AUTH_CLIENT_ID ?? "xxx-xxx-xxx-xxx";
export const OIDC_REDIRECT_URI: string =
  import.meta.env.VITE_APP_AUTH_REDIRECT_URI ?? "";
export const OIDC_POST_LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_APP_AUTH_POST_LOGOUT_REDIRECT_URI ?? "";
export const OIDC_SILENT_REDIRECT_URI =
  import.meta.env.VITE_APP_AUTH_SILENT_REDIRECT_URI ?? "";

export const UI_APPLICATION_NAME =
  import.meta.env.VITE_APP_UI_APPLICATION_NAME ?? "Rental Clone";
export const DEPLOYMENT_ENV =
  import.meta.env.VITE_APP_DEPLOYMENT_ENV || "development";

export const IS_DEV = DEPLOYMENT_ENV !== "production";
export const APP_VERSION = import.meta.env.APP_VERSION ?? "0.0.0-abcdefg";

export const SETTINGS_LOCATION_KEYS = {
  application: "application",
  profile: "profile",
  runtimeConfiguration: "runtime-configuration",
  vehiclesAndCategories: "vehicles-and-categories",
  ratesAndCharges: "rates-and-charges",
} as const;
