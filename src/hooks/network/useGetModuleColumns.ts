import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchModuleColumns } from "../../api/columns";
import type { ColumnListItemType } from "../../types/Column";

type ModuleType = "reservations" | "agreements" | "customers" | "vehicles";

export function useGetModuleColumns({ module }: { module: ModuleType }) {
  const auth = useAuth();
  const query = useQuery<ColumnListItemType[]>({
    queryKey: [module, "columns"],
    queryFn: () =>
      fetchModuleColumns({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        module,
      }).then((data) => mutateColumnAccessors(module, data)),
    enabled: auth.isAuthenticated,
    initialData: makeInitialColumnAccessors(module),
  });
  return query;
}

export function mutateColumnAccessors(
  type: ModuleType,
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
      return data;
    case "vehicles":
      return data;
    default:
      return data;
  }
}

export function makeInitialColumnAccessors(module: ModuleType) {
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
