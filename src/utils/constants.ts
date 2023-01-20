export const LS_OIDC_REDIRECT_URI_KEY = "oidc:redirect_uri";

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
