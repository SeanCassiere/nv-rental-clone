export const LS_OIDC_REDIRECT_URI_KEY = "oidc:redirect_uri" as const;

export const apiBaseUrl = import.meta.env.VITE_APP_API_URI
  ? `${import.meta.env.VITE_APP_API_URI}/api`
  : "https://testapi.appnavotar.com/api";

export const USER_STORAGE_KEYS = {
  dateFormat: "date-format",
  timeFormat: "time-format",
  dismissedMessages: "dismissed-messages",
  tableRowCount: "table-row-count",
  currency: "currency",
  currencyDigits: "currency-digits",
  theme: "theme",
} as const;

export const APP_DEFAULTS = {
  tableRowCount: "10",
  currencyDigits: "2",
} as const;

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
export const UI_APPLICATION_SHOW_ROUTER_DEVTOOLS =
  import.meta.env.VITE_APP_UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === "true"
    ? true
    : false;

export const IS_LOCAL_DEV = OIDC_REDIRECT_URI.startsWith("http://localhost");
export const APP_VERSION = import.meta.env.APP_VERSION ?? "0.0.0-abcdefg";

export const SETTINGS_LOCATION_KEYS = {
  application: "application",
  profile: "profile",
  runtimeConfiguration: "runtime-configuration",
  vehiclesAndCategories: "vehicles-and-categories",
  ratesAndCharges: "rates-and-charges",
} as const;
