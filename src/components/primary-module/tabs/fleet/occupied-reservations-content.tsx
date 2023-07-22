import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/router";
import { useTranslation } from "react-i18next";

import { CommonTable } from "../../../common/common-table";

import { useGetReservationsList } from "@/hooks/network/reservation/useGetReservationsList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";

import { type TReservationListItemParsed } from "@/schemas/reservation";
import { normalizeReservationListSearchParams } from "@/utils/normalize-search-params";
import { sortColOrderByOrderIndex } from "@/utils/ordering";
import { viewReservationByIdRoute } from "@/routes/reservations/reservationIdPath";
import { searchReservationsRoute } from "@/routes/reservations/searchReservations";
import { ReservationDateTimeColumns } from "@/utils/columns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";

interface FleetOccupiedReservationsTabProps {
  vehicleId: string;
  vehicleNo: string | undefined;
}

const columnHelper = createColumnHelper<TReservationListItemParsed>();

const acceptedColumns = [
  "ReservationNumber",
  "ReservationType",
  "ReservationStatusName",
  "FirstName",
  "LastName",
  "StartDate",
  "EndDate",
  "StartLocationName",
  "EndLocationName",
];

const pageSize = 50;

const FleetOccupiedReservationsTab = (
  props: FleetOccupiedReservationsTabProps
) => {
  const { t } = useTranslation();
  const items = normalizeReservationListSearchParams({
    page: 1,
    size: pageSize,
    filters: { VehicleNo: props.vehicleNo },
  });

  const columnsData = useGetModuleColumns({ module: "reservations" });

  const dataList = useGetReservationsList({
    page: items.pageNumber,
    pageSize: items.size,
    filters: items.searchFilters,
  });

  const columnDefs = useMemo(() => {
    const columns: ColumnDef<TReservationListItemParsed>[] = [];

    columnsData.data.sort(sortColOrderByOrderIndex).forEach((column) => {
      if (acceptedColumns.includes(column.columnHeader) === false) return;

      columns.push(
        columnHelper.accessor(column.columnHeader as any, {
          id: column.columnHeader,
          header: ({ column: columnChild }) => (
            <DataTableColumnHeader
              column={columnChild}
              title={column.columnHeaderDescription ?? ""}
            />
          ),
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "ReservationNumber") {
              const reservationId = item.table.getRow(item.row.id).original.id;
              return (
                <Link
                  to={viewReservationByIdRoute.to}
                  params={{ reservationId: String(reservationId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-semibold text-slate-800"
                  preload="intent"
                >
                  {value as any}
                </Link>
              );
            }
            if (column.columnHeader === "ReservationStatusName") {
              return <Badge variant="outline">{String(value)}</Badge>;
            }

            if (ReservationDateTimeColumns.includes(column.columnHeader)) {
              return t("intlDateTime", { value: new Date(value as any) });
            }

            return value;
          },
          enableHiding: false,
          enableSorting: false,
        })
      );
    });

    return columns;
  }, [columnsData.data, t]);

  if (!props.vehicleNo) return null;

  return (
    <div className="max-w-full focus:ring-0">
      <CommonTable data={dataList.data?.data || []} columns={columnDefs} />

      {dataList.data?.isRequestMade === false ? null : dataList.data?.data
          .length === 0 ? null : (
        <div className="py-4">
          <p className="text-slate-700">
            Showing a maximum of {pageSize} records.
          </p>
          <Link
            to={searchReservationsRoute.to}
            search={() => ({ filters: { VehicleNo: props.vehicleNo } }) as any}
            className="text-slate-600 underline hover:text-slate-800"
          >
            Need more? Click here to search for reservations.
          </Link>
        </div>
      )}
    </div>
  );
};

export default FleetOccupiedReservationsTab;