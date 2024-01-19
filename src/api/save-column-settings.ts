import type { TColumnHeaderItem } from "@/schemas/client/column";

import { getModuleApiName } from "@/utils/columns";
import type { Auth } from "@/utils/query/helpers";
import type { AppModule } from "@/types/app-module";

import { apiClient } from "@/api";

export async function saveColumnSettings(
  input: {
    accessorKeys?: string[];
    allColumns: TColumnHeaderItem[];
    module: AppModule;
  } & Auth
) {
  const { accessorKeys = [], allColumns, module } = input;

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
      clientID: input.auth.clientId,
      userID: input.auth.userId,
      type: modValues.moduleId,
      typeName: modValues.capitalModule,
      headerSettingIDList: headerSettingVisibleIdList.join(","),
      orderdHeaderSettingIDList: orderedColumnsIdList.join(","),
    },
  });
}
