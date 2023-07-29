import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

import { UserLanguageListSchema } from "@/schemas/user";

export const fetchUserProfile = async (
  opts: CommonAuthParams & { currentUserId: string }
) => {
  return await callV3Api(
    makeUrl(`/v3/users/${opts.userId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
      currentUserId: opts.currentUserId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => res.data);
};

export const fetchUserLanguages = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl("/v3/users/language", {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => UserLanguageListSchema.parse(res.data));
};
