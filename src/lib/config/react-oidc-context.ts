import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthProviderNoUserManagerProps } from "react-oidc-context";

import {
  OIDC_AUTHORITY,
  OIDC_CLIENT_ID,
  OIDC_POST_LOGOUT_REDIRECT_URI,
  OIDC_REDIRECT_URI,
  OIDC_SILENT_REDIRECT_URI,
} from "@/lib/utils/constants";

import { queryClient } from "@/lib/config/tanstack-query";

export const reactOidcContextConfig: AuthProviderNoUserManagerProps = {
  authority: OIDC_AUTHORITY,
  metadataUrl: `${OIDC_AUTHORITY}/.well-known/openid-configuration`,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URI,
  post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI,
  silent_redirect_uri: OIDC_SILENT_REDIRECT_URI,
  response_type: "code",
  response_mode: "query" as const,
  scope: "openid profile Api email",
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: async (user) => {
    await queryClient.invalidateQueries();
  },
};
