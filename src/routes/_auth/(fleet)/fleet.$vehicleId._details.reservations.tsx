import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { CommonTable } from "@/components/common-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";

import type { TReservationListItemParsed } from "@/lib/schemas/reservation";
import {
  fetchReservationsSearchColumnsOptions,
  fetchReservationsSearchListOptions,
} from "@/lib/query/reservation";

import { Container } from "@/routes/-components/container";

import {
  ReservationDateTimeColumns,
  sortColOrderByOrderIndex,
} from "@/lib/utils/columns";
import { normalizeReservationListSearchParams } from "@/lib/utils/normalize-search-params";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/reservations"
)({
  beforeLoad: ({
    context: { authParams: auth, queryClient, viewVehicleOptions },
    params,
  }) => {
    const vehicleCache = queryClient.getQueryData(viewVehicleOptions.queryKey);

    const vehicle = vehicleCache?.status === 200 ? vehicleCache.body : null;

    const vehicleNo = vehicle?.vehicle?.vehicleNo || null;

    if (!vehicleNo) {
      throw redirect({
        to: "/fleet/$vehicleId/summary",
        params,
        replace: true,
      });
    }

    const search = normalizeReservationListSearchParams({
      page: 1,
      size: 50,
      filters: { VehicleNo: vehicle?.vehicle?.vehicleNo || undefined },
    });

    return {
      vehicleNo,
      reservationColumnsOptions: fetchReservationsSearchColumnsOptions({
        auth,
      }),
      reservationListOptions: fetchReservationsSearchListOptions({
        auth,
        pagination: {
          page: search.pageNumber,
          pageSize: search.size,
        },
        filters: {
          ...search.searchFilters,
          clientDate: new Date(),
        },
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.reservationColumnsOptions),
      context.queryClient.ensureQueryData(context.reservationListOptions),
    ];

    await Promise.all(promises);

    return;
  },
  component: Component,
});

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

function Component() {
  const { vehicleNo, reservationColumnsOptions, reservationListOptions } =
    Route.useRouteContext();

  const { t } = useTranslation();

  const reservationsQuery = useSuspenseQuery(reservationListOptions);
  const columnsQuery = useSuspenseQuery(reservationColumnsOptions);

  const columnDefs = React.useMemo(() => {
    const columns: ColumnDef<TReservationListItemParsed>[] = [];

    (columnsQuery.data.status === 200 ? columnsQuery.data.body : [])
      .sort(sortColOrderByOrderIndex)
      .forEach((column) => {
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
                const reservationId = item.table.getRow(item.row.id).original
                  .id;
                return (
                  <Link
                    to="/reservations/$reservationId/summary"
                    params={{ reservationId: String(reservationId) }}
                    className="font-semibold"
                  >
                    {value as any}
                  </Link>
                );
              }
              if (column.columnHeader === "ReservationStatusName") {
                return <Badge variant="outline">{String(value)}</Badge>;
              }

              if (ReservationDateTimeColumns.includes(column.columnHeader)) {
                return t("intlDateTime", {
                  value: new Date(value as any),
                  ns: "format",
                });
              }

              return value;
            },
            enableHiding: false,
            enableSorting: false,
          })
        );
      });

    return columns;
  }, [columnsQuery.data, t]);

  const reservationsList =
    reservationsQuery.data?.status === 200 ? reservationsQuery.data.body : [];

  return (
    <Container as="div">
      <div className="mb-6 max-w-full px-2 sm:px-4">
        {reservationsQuery.status === "success" && (
          <CommonTable data={reservationsList} columns={columnDefs} />
        )}

        {reservationsQuery.status === "success" &&
          reservationsList.length > 0 && (
            <div className="py-4">
              <p className="text-muted-foreground">
                Showing a maximum of {pageSize} records.
              </p>
              <Link
                to="/reservations"
                search={(prev) => ({
                  ...prev,
                  filters: { VehicleNo: vehicleNo },
                })}
                className="text-muted-foreground underline"
              >
                Need more? Click here to search for reservations.
              </Link>
            </div>
          )}
      </div>
    </Container>
  );
}
