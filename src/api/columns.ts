import { getModuleApiName } from "@/utils/columns";
import type { AppPrimaryModuleType } from "@/types/General";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const saveModuleColumns = async (
  opts: {
    module: AppPrimaryModuleType;
    headerSettingIDList: string;
    orderHeaderSettingIDList: string;
  } & CommonAuthParams
) => {
  const { moduleId, capitalModule } = getModuleApiName(opts.module);
  const body = {
    clientID: opts.clientId,
    userID: opts.userId,
    type: moduleId,
    typeName: capitalModule,
    headerSettingIDList: opts.headerSettingIDList,
    orderdHeaderSettingIDList: opts.orderHeaderSettingIDList,
  };

  return await callV3Api(makeUrl("/v3/clients/columnheaderinformation", {}), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
    },
  });
};
