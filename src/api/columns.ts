import type { ColumnResponseType } from "../types/Column";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchModuleColumns = async (
  opts: {
    module: "reservations" | "agreements" | "customers" | "vehicles";
  } & CommonAuthParams
) => {
  let module = "reservation";
  switch (opts.module) {
    case "reservations":
      module = "reservation";
      break;
    case "agreements":
      module = "agreement";
      break;
    case "customers":
      module = "customer";
      break;
    case "vehicles":
      module = "vehicle";
      break;
    default:
      module = "reservation";
  }

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
