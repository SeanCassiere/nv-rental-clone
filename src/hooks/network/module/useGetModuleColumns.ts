import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchModuleColumns } from "../../../api/columns";
import type { ColumnListItemType } from "../../../types/Column";
import type { AppPrimaryModuleType } from "../../../types/General";

export function useGetModuleColumns({
  module,
}: {
  module: AppPrimaryModuleType;
}) {
  const auth = useAuth();
  const query = useQuery<ColumnListItemType[]>({
    queryKey: [module, "columns"],
    queryFn: () =>
      fetchModuleColumns({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        module,
      })
        .then((data) => mutateColumnAccessors(module, data))
        .then((cols) =>
          cols.sort(
            (col1, col2) =>
              col1.columnHeaderSettingID - col2.columnHeaderSettingID // sort by columnHeaderSettingID
          )
        ),
    enabled: auth.isAuthenticated,
    initialData: makeInitialColumnAccessors(module),
  });
  return query;
}

export function mutateColumnAccessors(
  type: AppPrimaryModuleType,
  data: ColumnListItemType[]
) {
  switch (type) {
    case "reservations":
      return data;
    case "agreements":
      return data.map((column) => {
        if (column.columnHeader === "CustomerName") {
          column.columnHeader = "FullName";
          column.searchText = "FullName";
        }
        if (column.columnHeader === "Phone") {
          column.columnHeader = "HPhone";
          column.searchText = "HPhone";
        }
        return column;
      });
    case "customers":
      return data.map((column) => {
        if (column.columnHeader === "DateOfbirth") {
          column.columnHeader = "DateOfbirth";
          column.searchText = "DateOfbirth";
        }
        if (column.columnHeader === "CreatedByName") {
          column.columnHeader = "CreatedByName";
          column.searchText = "CreatedByName";
        }
        return column;
      });
    case "vehicles":
      return data;
    default:
      return data;
  }
}

export function makeInitialColumnAccessors(module: AppPrimaryModuleType) {
  switch (module) {
    case "reservations":
      return [];
    case "agreements":
      return [
        {
          columnHeader: "AgreementNumber",
          typeName: "Agreement",
          columnHeaderDescription: "Agreement No.",
          searchText: "AgreementNo",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 1,
          orderIndex: 1,
        },
        {
          columnHeader: "AgreementType",
          typeName: "Agreement",
          columnHeaderDescription: "Agreement Type",
          searchText: "AgreementType",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 1,
          orderIndex: 2,
        },
      ];
    case "customers":
      return [];
    case "vehicles":
      return [];
    default:
      return [];
  }
}
