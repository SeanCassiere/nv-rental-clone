import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/router";
import {
  createColumnHelper,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "lucide-react";

import ProtectorShield from "@/components/protector-shield";

import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { viewReservationByIdRoute } from "@/routes/reservations/reservation-id-route";
import { addReservationRoute } from "@/routes/reservations/add-reservation-route";

import { useGetReservationsList } from "@/hooks/network/reservation/useGetReservationsList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetReservationStatusList } from "@/hooks/network/reservation/useGetReservationStatusList";
import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetReservationTypesList } from "@/hooks/network/reservation/useGetReservationTypes";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import {
  PrimaryModuleTable,
  PrimaryModuleTableColumnHeader,
  PrimaryModuleTableCellWrap,
} from "@/components/primary-module/table";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/utils";
import { type TReservationListItemParsed } from "@/schemas/reservation";
import { normalizeReservationListSearchParams } from "@/utils/normalize-search-params";
import { titleMaker } from "@/utils/title-maker";
import { ReservationDateTimeColumns } from "@/utils/columns";
import { sortColOrderByOrderIndex } from "@/utils/ordering";

const columnHelper = createColumnHelper<TReservationListItemParsed>();

function ReservationsSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const search = useSearch({ from: searchReservationsRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeReservationListSearchParams(search);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    Object.entries(searchFilters).reduce(
      (prev, [key, value]) => [...prev, { id: key, value }],
      [] as ColumnFiltersState
    )
  );

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
      pageSize: size,
    }),
    [pageNumber, size]
  );

  const reservationsData = useGetReservationsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const reservationStatusList = useGetReservationStatusList();
  const reservationStatuses = reservationStatusList.data ?? [];

  const vehicleTypesList = useGetVehicleTypesList();
  const vehicleTypes = vehicleTypesList.data ?? [];

  const locationsList = useGetLocationsList({ locationIsActive: true });
  const locations = locationsList.data?.data ?? [];

  const reservationTypesList = useGetReservationTypesList();
  const reservationTypes = reservationTypesList.data ?? [];

  const columnsData = useGetModuleColumns({ module: "reservations" });

  const columnDefs = useMemo(
    () =>
      columnsData.data.sort(sortColOrderByOrderIndex).map((column) =>
        columnHelper.accessor(column.columnHeader as any, {
          id: column.columnHeader,
          meta: {
            columnName: column.columnHeaderDescription ?? undefined,
          },
          header: ({ column: columnChild }) => (
            <PrimaryModuleTableColumnHeader
              column={columnChild}
              title={column.columnHeaderDescription ?? ""}
            />
          ),
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "ReservationNumber") {
              const reservationId = item.table.getRow(item.row.id).original.id;
              return (
                <PrimaryModuleTableCellWrap>
                  <Link
                    to={viewReservationByIdRoute.to}
                    params={{ reservationId: String(reservationId) }}
                    search={() => ({ tab: "summary" })}
                    className={cn(buttonVariants({ variant: "link" }), "p-0")}
                    preload="intent"
                  >
                    {value}
                  </Link>
                </PrimaryModuleTableCellWrap>
              );
            }
            if (column.columnHeader === "ReservationStatusName") {
              return (
                <PrimaryModuleTableCellWrap>
                  <Badge variant="outline">{value}</Badge>
                </PrimaryModuleTableCellWrap>
              );
            }

            if (ReservationDateTimeColumns.includes(column.columnHeader)) {
              return (
                <PrimaryModuleTableCellWrap>
                  {t("intlDateTime", { value: new Date(value) })}
                </PrimaryModuleTableCellWrap>
              );
            }

            return (
              <PrimaryModuleTableCellWrap>{value}</PrimaryModuleTableCellWrap>
            );
          },
          enableHiding: column.columnHeader !== "ReservationNumber",
          enableSorting: false,
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "reservations" });

  const handleSaveColumnsOrder = useCallback(
    (newColumnOrder: ColumnOrderState) => {
      saveColumnsMutation.mutate({
        allColumns: columnsData.data,
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation]
  );

  const handleSaveColumnVisibility = useCallback(
    (graph: VisibilityState) => {
      const newColumnsData = columnsData.data.map((col) => {
        col.isSelected = graph[col.columnHeader] || false;
        return col;
      });
      saveColumnsMutation.mutate({ allColumns: newColumnsData });
    },
    [columnsData.data, saveColumnsMutation]
  );

  useDocumentTitle(titleMaker("Reservations"));

  return (
    <ProtectorShield>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6 text-primary">
            Reservations
          </h1>
          <Link
            to={addReservationRoute.to}
            search={() => ({ stage: "rental-information" })}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <PlusIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline-block">New Reservation</span>
          </Link>
        </div>
        <p className={cn("text-base text-primary/80")}>
          Search through your bookings and view details.
        </p>
        <Separator className="mt-3.5" />
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <PrimaryModuleTable
          data={reservationsData.data?.data || []}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          rawColumnsData={columnsData?.data || []}
          onColumnVisibilityChange={handleSaveColumnVisibility}
          totalPages={
            reservationsData.data?.totalRecords
              ? Math.ceil(reservationsData.data?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            navigate({
              to: searchReservationsRoute.to,
              params: {},
              search: (current) => ({
                ...current,
                page: newPaginationState.pageIndex + 1,
                size: newPaginationState.pageSize,
                filters: searchFilters,
              }),
            });
          }}
          filters={{
            columnFilters,
            setColumnFilters,
            onClearFilters: () => {
              navigate({
                to: searchReservationsRoute.to,
                params: {},
                search: () => ({
                  page: 1,
                  size: pagination.pageSize,
                }),
              });
            },
            onSearchWithFilters: () => {
              const filters = columnFilters.reduce(
                (prev, current) => ({
                  ...prev,
                  [current.id]: current.value,
                }),
                {}
              );
              navigate({
                to: searchReservationsRoute.to,
                params: {},
                search: () => ({
                  page: pagination.pageIndex + 1,
                  size: pagination.pageSize,
                  filters,
                }),
              });
            },
            filterableColumns: [
              {
                id: "Keyword",
                title: "Search",
                type: "text",
                size: "large",
              },
              {
                id: "Statuses",
                title: "Status",
                type: "multi-select",
                options: reservationStatuses.map((item) => ({
                  value: `${item.id}`,
                  label: item.name,
                })),
                defaultValue: [],
              },
              {
                id: "ReservationTypes",
                title: "Type",
                type: "multi-select",
                options: reservationTypes.map((item) => ({
                  value: `${item.typeName}`,
                  label: item.typeName,
                })),
                defaultValue: [],
              },
              {
                id: "VehicleTypeId",
                title: "Vehicle type",
                type: "select",
                options: vehicleTypes.map((item) => ({
                  value: `${item.VehicleTypeId}`,
                  label: item.VehicleTypeName,
                })),
              },
              {
                id: "CreatedDateFrom",
                title: "Start date",
                type: "date",
              },
              {
                id: "CreatedDateTo",
                title: "End date",
                type: "date",
              },
              {
                id: "CheckoutLocationId",
                title: "Checkout location",
                type: "select",
                options: locations.map((item) => ({
                  value: `${item.locationId}`,
                  label: `${item.locationName}`,
                })),
              },
              {
                id: "CheckinLocationId",
                title: "Checkin location",
                type: "select",
                options: locations.map((item) => ({
                  value: `${item.locationId}`,
                  label: `${item.locationName}`,
                })),
              },
            ],
          }}
        />
      </section>
    </ProtectorShield>
  );
}

export default ReservationsSearchPage;
