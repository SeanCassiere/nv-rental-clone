import { z } from "zod";

import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

import { UserLanguageListSchema, type UpdateUserInput } from "@/schemas/user";
import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";

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

const StringArraySchema = z.array(z.string());

export const fetchUserPermissions = async (
  opts: Omit<CommonAuthParams, "userId"> & { intendedUserId: string }
) => {
  return await callV3Api(
    makeUrl(`/v3/users/${opts.intendedUserId}/permissions`, {
      clientId: opts.clientId,
    }),
    {
      headers: { Authorization: `Bearer ${opts.accessToken}` },
    }
  ).then((res) => StringArraySchema.parse(res.data));
};

export const updateUserProfile = async ({
  auth,
  payload: { userId, ...payload },
}: {
  auth: CommonAuthParams;
  payload: UpdateUserInput & { userId: string };
}) => {
  const insertPayload = {
    ...payload,
    createdBy: auth.userId,
    createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(new Date()),
  };
  return await callV3Api(makeUrl(`/v3/users/${userId}`, {}), {
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    method: "PUT",
    body: JSON.stringify(insertPayload),
  });
};
