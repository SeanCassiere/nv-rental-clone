import type { TColumnHeaderItem } from "@/schemas/client/column";

import type { AppModule } from "@/types/app-module";

import type { apiClient } from "@/api";

export const ReservationDateTimeColumns = [
  "CreatedDate",
  "StartDate",
  "EndDate",
];

export const AgreementDateTimeColumns = [
  "CreatedDate",
  "CheckoutDate",
  "CheckinDate",
  "ReturnDate",
];

export function getModuleApiName(module: AppModule) {
  switch (module) {
    case "agreements":
      return {
        module: "agreement",
        moduleId: 4,
        capitalModule: "Agreement",
      } as const;
    case "customers":
      return {
        module: "customer",
        moduleId: 3,
        capitalModule: "Customer",
      } as const;
    case "vehicles":
      return {
        module: "vehicle",
        moduleId: 1,
        capitalModule: "Vehicle",
      } as const;
    case "reservations":
    default:
      return {
        module: "reservation",
        moduleId: 2,
        capitalModule: "Reservation",
      } as const;
  }
}

// mutate columns
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
  type: Parameters<
    (typeof apiClient)["client"]["getColumnHeaderInfo"]
  >[0]["query"]["module"],
  data: { status: number; body: TColumnHeaderItem[]; headers: Headers }
) {
  switch (type) {
    case "reservation":
      const reservationColumnData = settingStartingColumn(
        data.body,
        "ReservationNumber"
      );

      return {
        ...data,
        body: reservationColumnData
          .map((column) => {
            if (column.columnHeader in reservationColumnHeaderMap) {
              column.columnHeader = reservationColumnHeaderMap[
                column.columnHeader
              ] as string;
              column.searchText = reservationColumnHeaderMap[
                column.columnHeader
              ] as string;
            }

            return column;
          })
          .sort(sortColumnsByColumnSettingId),
      };
    case "agreement":
      const agreementColumnData = settingStartingColumn(
        data.body,
        "AgreementNumber"
      );
      return {
        ...data,
        body: agreementColumnData
          .map((column) => {
            if (column.columnHeader in agreementColumnHeaderMap) {
              column.columnHeader = agreementColumnHeaderMap[
                column.columnHeader
              ] as string;
              column.searchText = agreementColumnHeaderMap[
                column.columnHeader
              ] as string;
            }

            return column;
          })
          .sort(sortColumnsByColumnSettingId),
      };
    case "customer":
      const customerColumnData = settingStartingColumn(data.body, "FirstName");
      return {
        ...data,
        body: customerColumnData
          .map((column) => {
            if (column.columnHeader in customerColumnHeaderMap) {
              column.columnHeader = customerColumnHeaderMap[
                column.columnHeader
              ] as string;
              column.searchText = customerColumnHeaderMap[
                column.columnHeader
              ] as string;
            }

            return column;
          })
          .sort(sortColumnsByColumnSettingId),
      };
    case "vehicle":
      const vehicleColumnData = settingStartingColumn(data.body, "VehicleNo");
      return {
        ...data,
        body: vehicleColumnData.sort(sortColumnsByColumnSettingId),
      };
    default:
      return data;
  }
}

function settingStartingColumn(
  columns: TColumnHeaderItem[],
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

function sortColumnsByColumnSettingId(
  column1: TColumnHeaderItem,
  column2: TColumnHeaderItem
) {
  return column1.columnHeaderSettingID - column2.columnHeaderSettingID;
}

export function sortColumnsByOrderIndex(
  col1: TColumnHeaderItem,
  col2: TColumnHeaderItem
) {
  return col1.orderIndex - col2.orderIndex;
}
