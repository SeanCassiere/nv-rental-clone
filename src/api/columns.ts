import type { ColumnResponseType } from "../types/Column";
import type { AppPrimaryModuleType } from "../types/General";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

function getModuleApiName(module: AppPrimaryModuleType) {
  switch (module) {
    case "agreements":
      return {
        module: "agreement",
        moduleId: 4,
        capitalModule: "Agreement",
      };
    case "customers":
      return {
        module: "customer",
        moduleId: 3,
        capitalModule: "Customer",
      };
    case "vehicles":
      return {
        module: "vehicle",
        moduleId: 1,
        capitalModule: "Vehicle",
      };
    case "reservations":
    default:
      return {
        module: "reservation",
        moduleId: 2,
        capitalModule: "Reservation",
      };
  }
}

export const fetchModuleColumns = async (
  opts: {
    module: "reservations" | "agreements" | "customers" | "vehicles";
  } & CommonAuthParams
) => {
  const { module } = getModuleApiName(opts.module);

  const response = await callV3Api(
    makeUrl(`/v3/clients/columnHeaderInformation`, {
      clientId: opts.clientId,
      userId: opts.userId,
      module,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => res.data);

  const columns = response.map((column: ColumnResponseType) => ({
    ...column,
    isSelected: column.isSelected === "true",
  }));

  return columns;
};

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

  return await callV3Api(makeUrl("/v3/clients/columnHeaderInformation", {}), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
    },
  });
};
