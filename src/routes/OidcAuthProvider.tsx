import {
  AuthProvider,
  type AuthProviderNoUserManagerProps,
} from "react-oidc-context";

import { LS_OIDC_REDIRECT_URI_KEY } from "../utils/constants";

const AUTHORITY =
  import.meta.env.VITE_APP_AUTH_AUTHORITY || "https://testauth.appnavotar.com/";
const CLIENT_ID = import.meta.env.VITE_APP_AUTH_CLIENT_ID ?? "xxx-xxx-xxx-xxx";
const REDIRECT_URI = import.meta.env.VITE_APP_AUTH_REDIRECT_URI ?? "";
const POST_LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_APP_AUTH_POST_LOGOUT_REDIRECT_URI ?? "";
const SILENT_REDIRECT_URI =
  import.meta.env.VITE_APP_AUTH_SILENT_REDIRECT_URI ?? "";

const config: AuthProviderNoUserManagerProps = {
  authority: AUTHORITY,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  silent_redirect_uri: SILENT_REDIRECT_URI,
  response_type: "code",
  response_mode: "query" as const,
  scope: "openid profile Api",
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
  onSigninCallback: async () => {
    const redirectUri = window.localStorage.getItem(LS_OIDC_REDIRECT_URI_KEY);
    if (redirectUri && redirectUri !== "") {
      window.location.replace(redirectUri);
    } else {
      window.location.replace("/");
    }
  },
};

export const OidcAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider {...config}>{children}</AuthProvider>;
};
