import { z } from "zod";

import type { MyRouterContext } from "@/routes/__root";

import { OIDC_AUTHORITY, OIDC_CLIENT_ID } from "./constants";

const OidcWebStorageSchema = z.object({
  access_token: z.string(),
  expires_at: z.number(),
  profile: z.object({
    navotar_clientid: z.string(),
    navotar_userid: z.string(),
    sub: z.string(),
    preferred_username: z.string().nullable(),
  }),
});
export function getAuthToken() {
  const key = `oidc.user:${OIDC_AUTHORITY}:${OIDC_CLIENT_ID}`;
  const sessionItem = window.localStorage.getItem(key);

  if (!sessionItem) {
    return null;
  }

  try {
    const data = OidcWebStorageSchema.parse(JSON.parse(sessionItem));

    if (data.expires_at * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    return data;
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof Error) {
      console.error("getAuthToken error\n", error);
    }

    return null;
  }
}

export function getAuthFromAuthHook(auth: MyRouterContext["auth"]) {
  let clientId = "";
  let userId = "";
  let accessToken = "";

  if (
    auth.user &&
    auth.user.profile.navotar_clientid &&
    auth.user.profile.navotar_userid &&
    auth.user.access_token
  ) {
    clientId = auth.user.profile.navotar_clientid;
    userId = auth.user.profile.navotar_userid;
    accessToken = auth.user.access_token;
  }

  return { clientId, userId, accessToken };
}

export function getAuthFromRouterContext(context: MyRouterContext) {
  return getAuthFromAuthHook(context.auth);
}
