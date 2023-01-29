import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchModuleColumns } from "../../../api/columns";
import type { AppPrimaryModuleType } from "../../../types/General";
import {
  agreementQKeys,
  reservationQKeys,
  customerQKeys,
  vehicleQKeys,
} from "../../../utils/query-key";
import {
  ColumnListItemListSchema,
  type TColumnListItemParsed,
} from "../../../utils/schemas/column";

export const allModulesKeySelector = (module: AppPrimaryModuleType) => {
  switch (module) {
    case "reservations":
      return reservationQKeys;
    case "agreements":
      return agreementQKeys;
    case "customers":
      return customerQKeys;
    case "vehicles":
      return vehicleQKeys;
  }
};

export function useGetModuleColumns({
  module,
}: {
  module: AppPrimaryModuleType;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: allModulesKeySelector(module).columns(),
    queryFn: () =>
      fetchModuleColumnsModded({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        module,
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialColumnAccessors(module),
  });
  return query;
}

export async function fetchModuleColumnsModded(
  params: Parameters<typeof fetchModuleColumns>[0]
) {
  return await fetchModuleColumns({
    clientId: params.clientId || "",
    userId: params.userId || "",
    accessToken: params.accessToken || "",
    module: params.module,
  })
    .then((data) => ColumnListItemListSchema.parse(data))
    .then((data) => mutateColumnAccessors(params.module, data))
    .then((cols) =>
      cols.sort(
        (col1, col2) => col1.columnHeaderSettingID - col2.columnHeaderSettingID // sort by columnHeaderSettingID
      )
    )
    .catch((e) => {
      console.error(e);
      throw e;
    });
}

type ColumMap = { [columnHeader in string]: string };

const reservationColumnHeaderMap: ColumMap = {
  CheckoutDate: "StartDate",
  CheckinDate: "EndDate",
  Note: "Note",
  Company: "Company",
  ReservationNumber: "ReservationNumber",
  Phone: "Phone",
  StartLocationName: "StartLocationName",
  EndLocationName: "EndLocationName",
  CreatedDate: "CreatedDate",
};

const agreementColumnHeaderMap: ColumMap = {
  CustomerName: "FullName",
  Phone: "HPhone",
};

const customerColumnHeaderMap: ColumMap = {
  DateOfbirth: "DateOfbirth",
  CreatedByName: "CreatedByName",
  Phone: "hPhone",
  Address: "Address1",
  Zip: "ZipCode",
  InsuranceCompanyName: "InsuranceCompanyName",
};

export function mutateColumnAccessors(
  type: AppPrimaryModuleType,
  data: TColumnListItemParsed[]
) {
  switch (type) {
    case "reservations":
      const reservationColumnData = settingStartingColumn(
        data,
        "ReservationNumber"
      );

      return reservationColumnData.map((column) => {
        if (column.columnHeader in reservationColumnHeaderMap) {
          column.columnHeader = reservationColumnHeaderMap[
            column.columnHeader
          ] as string;
          column.searchText = reservationColumnHeaderMap[
            column.columnHeader
          ] as string;
        }

        return column;
      });
    case "agreements":
      const agreementColumnData = settingStartingColumn(
        data,
        "AgreementNumber"
      );
      return agreementColumnData.map((column) => {
        if (column.columnHeader in agreementColumnHeaderMap) {
          column.columnHeader = agreementColumnHeaderMap[
            column.columnHeader
          ] as string;
          column.searchText = agreementColumnHeaderMap[
            column.columnHeader
          ] as string;
        }

        return column;
      });
    case "customers":
      const customerColumnData = settingStartingColumn(data, "FirstName");
      return customerColumnData.map((column) => {
        if (column.columnHeader in customerColumnHeaderMap) {
          column.columnHeader = customerColumnHeaderMap[
            column.columnHeader
          ] as string;
          column.searchText = customerColumnHeaderMap[
            column.columnHeader
          ] as string;
        }

        return column;
      });
    case "vehicles":
      const vehicleColumnData = settingStartingColumn(data, "VehicleNo");
      return vehicleColumnData;
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

function settingStartingColumn(
  columns: TColumnListItemParsed[],
  startingColumnHeader: string
) {
  let columnData = columns;
  const numberActive = columns.filter((col) => col.isSelected).length;

  if (numberActive !== 0) {
    // because the user already has columns selected
    return columnData;
  }

  const findReservationNumber = columnData
    .map((d) => d.columnHeader)
    .indexOf(startingColumnHeader);

  if (numberActive === 0) {
    // if 0 columns are active
    if (columnData[findReservationNumber]) {
      (columnData[findReservationNumber] as any).isSelected = true;
    }
  }

  // setting the starting column
  if (
    columnData[findReservationNumber] &&
    (columnData[findReservationNumber]?.orderIndex !== 0 ||
      columnData[findReservationNumber]?.orderIndex !== 1)
  ) {
    columnData = columnData.map((col, idx) => ({
      ...col,
      orderIndex: col.columnHeader !== startingColumnHeader ? idx + 2 : 1,
    }));
  }

  return columnData;
}
