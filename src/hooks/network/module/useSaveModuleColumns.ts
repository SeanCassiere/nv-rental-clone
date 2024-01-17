import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import type { TColumnHeaderItem } from "@/schemas/client/column";

import { getModuleApiName } from "@/utils/columns";
import { fetchAgreementsSearchColumnsOptions } from "@/utils/query/agreement";
import { fetchCustomersSearchColumnsOptions } from "@/utils/query/customer";
import { fetchFleetSearchColumnsOptions } from "@/utils/query/fleet";
import { fetchReservationsSearchColumnsOptions } from "@/utils/query/reservation";
import type { AppPrimaryModuleType } from "@/types/General";

import { apiClient } from "@/api";

const allModulesKeySelector = (module: AppPrimaryModuleType) => {
  switch (module) {
    case "reservations":
      return fetchReservationsSearchColumnsOptions;
    case "agreements":
      return fetchAgreementsSearchColumnsOptions;
    case "customers":
      return fetchCustomersSearchColumnsOptions;
    case "vehicles":
      return fetchFleetSearchColumnsOptions;
  }
};

export function useSaveModuleColumns({
  module,
}: {
  module: AppPrimaryModuleType;
}) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      accessorKeys = [],
      allColumns,
    }: {
      accessorKeys?: string[];
      allColumns: TColumnHeaderItem[];
    }) => {
      const headerSettingVisibleIdList: number[] = [];

      const columnsMovedToTheFront: number[] = [];
      const columnsMovedToTheEnd: number[] = [];

      allColumns.forEach((column) => {
        if (column.isSelected) {
          headerSettingVisibleIdList.push(column.columnHeaderSettingID);
        }
      });

      if (accessorKeys.length > 0) {
        accessorKeys.forEach((accessorKey) => {
          const column = allColumns.find(
            (column) => column.columnHeader === accessorKey
          );
          if (column) {
            columnsMovedToTheFront.push(column.columnHeaderSettingID);
          }
        });

        allColumns
          .filter((column) => !accessorKeys.includes(column.columnHeader))
          .forEach((column) => {
            columnsMovedToTheEnd.push(column.columnHeaderSettingID);
          });
      } else {
        allColumns.forEach((column) => {
          columnsMovedToTheEnd.push(column.columnHeaderSettingID);
        });
      }
      const orderedColumnsIdList = [
        ...columnsMovedToTheFront,
        ...columnsMovedToTheEnd,
      ];

      const modValues = getModuleApiName(module);

      return await apiClient.client.saveColumnHeaderInfo({
        body: {
          clientID: auth.user?.profile.navotar_clientid || "",
          userID: auth.user?.profile.navotar_userid || "",
          type: modValues.moduleId,
          typeName: modValues.capitalModule,
          headerSettingIDList: headerSettingVisibleIdList.join(","),
          orderdHeaderSettingIDList: orderedColumnsIdList.join(","),
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: allModulesKeySelector(module)({
          auth: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
          },
        }).queryKey,
      });
    },
  });
  return mutation;
}
