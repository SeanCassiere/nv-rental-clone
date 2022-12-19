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
      return data.map((column) => {
        if (column.columnHeader === "CheckoutDate") {
          column.columnHeader = "StartDate";
          column.searchText = "StartDate";
        }
        if (column.columnHeader === "CheckinDate") {
          column.columnHeader = "EndDate";
          column.searchText = "EndDate";
        }
        if (column.columnHeader === "Note") {
          column.columnHeader = "Note";
          column.searchText = "Note";
        }
        if (column.columnHeader === "Company") {
          column.columnHeader = "Company";
          column.searchText = "Company";
        }
        if (column.columnHeader === "ReservationNumber") {
          column.columnHeader = "ReservationNumber";
          column.searchText = "ReservationNumber";
        }
        if (column.columnHeader === "Phone") {
          column.columnHeader = "Phone";
          column.searchText = "Phone";
        }
        if (column.columnHeader === "StartLocationName") {
          column.columnHeader = "StartLocationName";
          column.searchText = "StartLocationName";
        }
        if (column.columnHeader === "EndLocationName") {
          column.columnHeader = "EndLocationName";
          column.searchText = "EndLocationName";
        }
        if (column.columnHeader === "CreatedDate") {
          column.columnHeader = "CreatedDate";
          column.searchText = "CreatedDate";
        }
        return column;
      });
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
        if (column.columnHeader === "Phone") {
          column.columnHeader = "hPhone";
          column.searchText = "hPhone";
        }
        if (column.columnHeader === "Address") {
          column.columnHeader = "Address1";
          column.searchText = "Address1";
        }
        if (column.columnHeader === "Zip") {
          column.columnHeader = "ZipCode";
          column.searchText = "ZipCode";
        }
        if (column.columnHeader === "InsuranceCompanyName") {
          column.columnHeader = "InsuranceCompanyName";
          column.searchText = "InsuranceCompanyName";
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
      return [
        {
          columnHeader: "ReservationNumber",
          typeName: "Reservation",
          columnHeaderDescription: "Reservation No.",
          searchText: "ReservationNumber",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 1,
          orderIndex: 1,
        },
        {
          columnHeader: "ReservationType",
          typeName: "Reservation",
          columnHeaderDescription: "Reservation Type",
          searchText: "ReservationType",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 2,
          orderIndex: 2,
        },
        {
          columnHeader: "ReservationStatusName",
          typeName: "Reservation",
          columnHeaderDescription: "Status",
          searchText: "ReservationStatusName",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 3,
          orderIndex: 3,
        },
        {
          columnHeader: "VehicleType",
          typeName: "Reservation",
          columnHeaderDescription: "Vehicle Type",
          searchText: "VehicleType",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 4,
          orderIndex: 4,
        },
        {
          columnHeader: "FirstName",
          typeName: "Reservation",
          columnHeaderDescription: "First Name",
          searchText: "FirstName",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 5,
          orderIndex: 5,
        },
        {
          columnHeader: "LastName",
          typeName: "Reservation",
          columnHeaderDescription: "Last Name",
          searchText: "LastName",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 6,
          orderIndex: 6,
        },
      ];
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
          columnIndex: 2,
          orderIndex: 2,
        },
        {
          columnHeader: "AgreementStatusName",
          typeName: "Agreement",
          columnHeaderDescription: "Status",
          searchText: "AgreementStatusName",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 3,
          orderIndex: 3,
        },
        {
          columnHeader: "FullName",
          typeName: "Agreement",
          columnHeaderDescription: "Customer",
          searchText: "FullName",
          isSelected: true,
          columnHeaderSettingID: 0,
          columnIndex: 4,
          orderIndex: 4,
        },
      ];
    case "customers":
      return [
        {
          columnHeader: "FirstName",
          typeName: "Customer",
          columnHeaderDescription: "First Name",
          searchText: "FirstName",
          isSelected: true,
          columnHeaderSettingID: 36,
          columnIndex: 1,
          orderIndex: 1,
        },
        {
          columnHeader: "LastName",
          typeName: "Customer",
          columnHeaderDescription: "Last Name",
          searchText: "LastName",
          isSelected: true,
          columnHeaderSettingID: 37,
          columnIndex: 2,
          orderIndex: 2,
        },
        {
          columnHeader: "CustomerType",
          typeName: "Customer",
          columnHeaderDescription: "Customer Type",
          searchText: "CustomerType",
          isSelected: true,
          columnHeaderSettingID: 46,
          columnIndex: 0,
          orderIndex: 4,
        },
        {
          columnHeader: "DateOfbirth",
          typeName: "Customer",
          columnHeaderDescription: "Date Of Birth",
          searchText: "DateOfbirth",
          isSelected: true,
          columnHeaderSettingID: 48,
          columnIndex: 0,
          orderIndex: 8,
        },
        {
          columnHeader: "Email",
          typeName: "Customer",
          columnHeaderDescription: "Email",
          searchText: "Email",
          isSelected: true,
          columnHeaderSettingID: 47,
          columnIndex: 0,
          orderIndex: 3,
        },
      ];
    case "vehicles":
      return [
        {
          columnHeader: "VehicleNo",
          typeName: "Vehicle",
          columnHeaderDescription: "Vehicle No.",
          searchText: "VehicleNo",
          isSelected: true,
          columnHeaderSettingID: 1,
          columnIndex: 1,
          orderIndex: 1,
        },
        {
          columnHeader: "VehicleType",
          typeName: "Vehicle",
          columnHeaderDescription: "Vehicle Type",
          searchText: "VehicleType",
          isSelected: true,
          columnHeaderSettingID: 8,
          columnIndex: 2,
          orderIndex: 2,
        },
        {
          columnHeader: "LicenseNo",
          typeName: "Vehicle",
          columnHeaderDescription: "License No.",
          searchText: "LicenseNo",
          isSelected: true,
          columnHeaderSettingID: 1,
          columnIndex: 3,
          orderIndex: 3,
        },
        {
          columnHeader: "VehicleStatus",
          typeName: "Vehicle",
          columnHeaderDescription: "Status",
          searchText: "VehicleStatus",
          isSelected: true,
          columnHeaderSettingID: 7,
          columnIndex: 4,
          orderIndex: 4,
        },
        {
          columnHeader: "Color",
          typeName: "Vehicle",
          columnHeaderDescription: "Color",
          searchText: "Color",
          isSelected: true,
          columnHeaderSettingID: 3,
          columnIndex: 5,
          orderIndex: 5,
        },
        {
          columnHeader: "VehicleMakeName",
          typeName: "Vehicle",
          columnHeaderDescription: "Make",
          searchText: "VehicleMakeName",
          isSelected: true,
          columnHeaderSettingID: 4,
          columnIndex: 6,
          orderIndex: 6,
        },
        {
          columnHeader: "ModelName",
          typeName: "Vehicle",
          columnHeaderDescription: "Model",
          searchText: "ModelName",
          isSelected: true,
          columnHeaderSettingID: 5,
          columnIndex: 7,
          orderIndex: 7,
        },
        {
          columnHeader: "Year",
          typeName: "Vehicle",
          columnHeaderDescription: "Year",
          searchText: "Year",
          isSelected: true,
          columnHeaderSettingID: 6,
          columnIndex: 8,
          orderIndex: 8,
        },
      ];
    default:
      return [];
  }
}
