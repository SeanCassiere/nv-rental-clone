import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import { type AppPrimaryModuleType } from "../types/General";
import { NotesDataListSchema } from "../utils/schemas/note";
import { validateApiResWithZodSchema } from "../utils/schemas/apiFetcher";

export const fetchNotesForModule = async (
  opts: {
    referenceId: string;
    module: AppPrimaryModuleType;
  } & Omit<CommonAuthParams, "userId">,
) => {
  let url: URL;
  const authParams = { clientId: opts.clientId };

  if (opts.module === "agreements") {
    url = makeUrl(`/v3/agreement/${opts.referenceId}/note`, { ...authParams });
  } else if (opts.module === "reservations") {
    url = makeUrl(`/v3/reservation/${opts.referenceId}/note`, {
      ...authParams,
    });
  } else if (opts.module === "customers") {
    url = makeUrl(`/v3/customer/${opts.referenceId}/note`, { ...authParams });
  } else {
    // params.module === 'vehicles
    url = makeUrl(`/v3/vehicle/${opts.referenceId}/note`, { ...authParams });
  }

  return await callV3Api(url, {
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
    },
  })
    .then((res) => {
      if (res.ok) return res;
      return { ...res, data: [] };
    })
    .then((res) => validateApiResWithZodSchema(NotesDataListSchema, res));
};
