import { z } from "zod";
import { OIDC_AUTHORITY, OIDC_CLIENT_ID } from "./constants";

const OidcSessionStorageSchema = z.object({
  access_token: z.string(),
  profile: z.object({
    navotar_clientid: z.string(),
    navotar_userid: z.string(),
    sub: z.string(),
    preferred_username: z.string().nullable(),
  }),
});
export function getAuthToken() {
  const key = `oidc.user:${OIDC_AUTHORITY}:${OIDC_CLIENT_ID}`;
  const sessionItem = sessionStorage.getItem(key);

  if (!sessionItem) {
    return null;
  }

  try {
    const data = OidcSessionStorageSchema.parse(JSON.parse(sessionItem));
    return data;
  } catch (error) {
    return null;
  }
}
