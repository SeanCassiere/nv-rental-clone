import { UserManager, WebStorageStateStore } from "oidc-client-ts";

import {
  OIDC_AUTHORITY,
  OIDC_CLIENT_ID,
  OIDC_POST_LOGOUT_REDIRECT_URI,
  OIDC_REDIRECT_URI,
  OIDC_SILENT_REDIRECT_URI,
} from "@/lib/utils/constants";

const userStore = new WebStorageStateStore({ store: window.localStorage });

export const userManager = new UserManager({
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
  userStore,
});
