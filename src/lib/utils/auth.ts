import type { User } from "oidc-client-ts";
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
export function getAuthFromOidcStorage() {
  const key = `oidc.user:${OIDC_AUTHORITY}:${OIDC_CLIENT_ID}`;
  const storageItem = window.localStorage.getItem(key);

  if (!storageItem) {
    return null;
  }

  try {
    const data = OidcWebStorageSchema.parse(JSON.parse(storageItem));

    return data;
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof Error) {
      console.error("getAuthFromOidcStorage failed", error);
    }

    return null;
  }
}

export function getAuthFromAuthHook(auth: MyRouterContext["auth"]) {
  let clientId = "";
  let userId = "";

  if (
    auth.user &&
    typeof auth.user?.profile?.navotar_clientid === "string" &&
    typeof auth.user?.profile?.navotar_userid === "string"
  ) {
    clientId = auth.user.profile.navotar_clientid;
    userId = auth.user.profile.navotar_userid;
  }

  if (!clientId && !userId) {
    const local = getAuthFromOidcStorage();
    if (local) {
      clientId = local.profile.navotar_clientid;
      userId = local.profile.navotar_userid;
    }
  }

  return { clientId, userId };
}

export function getAuthFromRouterContext(context: MyRouterContext) {
  return getAuthFromAuthHook(context.auth);
}

/**
 * Checks if the user is valid and authenticated.
 * @param user - The user object from the `UserManager`.
 * @returns A boolean indicating if the user is valid and authenticated.
 * @example
 * ```ts
 * const user = context.auth.user;
 * const isValid = isUserValid(user);
 * if (!isValid) {
 *  throw redirect({ to: "/login" });
 * }
 * ```
 */
export function isValidUser(user: User | null | undefined) {
  const isAuthExpired = (user?.expires_at || 0) > Date.now();
  return !!user && !isAuthExpired;
}
