import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchUserProfile = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/users/${opts.userId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    },
  ).then((res) => res.data);
};
