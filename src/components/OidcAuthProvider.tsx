import {
  AuthProvider,
  type AuthProviderNoUserManagerProps,
} from "react-oidc-context";

import {
  OIDC_AUTHORITY,
  OIDC_CLIENT_ID,
  OIDC_REDIRECT_URI,
  OIDC_POST_LOGOUT_REDIRECT_URI,
  OIDC_SILENT_REDIRECT_URI,
} from "@/utils/constants";

const config: AuthProviderNoUserManagerProps = {
  authority: OIDC_AUTHORITY,
  metadataUrl: `${OIDC_AUTHORITY}/.well-known/openid-configuration`,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URI,
  post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI,
  silent_redirect_uri: OIDC_SILENT_REDIRECT_URI,
  response_type: "code",
  response_mode: "query" as const,
  scope: "openid profile Api",
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
};

export const OidcAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider {...config}>{children}</AuthProvider>;
};
