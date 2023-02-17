import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { saveModuleColumns } from "../../../api/columns";
import { allModulesKeySelector } from "./useGetModuleColumns";
import type { AppPrimaryModuleType } from "../../../types/General";
import { type TColumnListItemParsed } from "../../../utils/schemas/column";

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
      allColumns: TColumnListItemParsed[];
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

      return await saveModuleColumns({
        module,
        headerSettingIDList: headerSettingVisibleIdList.join(","),
        orderHeaderSettingIDList: orderedColumnsIdList.join(","),
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: allModulesKeySelector(module).columns(),
      });
    },
  });
  return mutation;
}
