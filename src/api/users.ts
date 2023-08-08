import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

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
