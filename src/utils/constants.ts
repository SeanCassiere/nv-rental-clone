export const LS_OIDC_REDIRECT_URI_KEY = "oidc:redirect_uri" as const;

export const USER_STORAGE_KEYS = {
  dateFormat: "date-format",
  timeFormat: "time-format",
  dismissedMessages: "dismissed-messages",
} as const;

export const OIDC_AUTHORITY =
  import.meta.env.VITE_APP_AUTH_AUTHORITY || "https://testauth.appnavotar.com/";
export const OIDC_CLIENT_ID =
  import.meta.env.VITE_APP_AUTH_CLIENT_ID ?? "xxx-xxx-xxx-xxx";
export const OIDC_REDIRECT_URI =
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
