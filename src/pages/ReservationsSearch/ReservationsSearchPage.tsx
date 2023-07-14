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

import Protector from "@/components/Protector";
import CommonHeader from "@/components/Layout/CommonHeader";
import { PlusIconFilled } from "@/components/icons";

import { searchReservationsRoute } from "@/routes/reservations/searchReservations";
import { viewReservationByIdRoute } from "@/routes/reservations/reservationIdPath";
import { addReservationRoute } from "@/routes/reservations/addReservation";

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

  const navigate = useNavigate({ from: searchReservationsRoute.id });

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
  const vehicleTypesList = useGetVehicleTypesList();
  const locationsList = useGetLocationsList({ locationIsActive: true });
  const reservationTypesList = useGetReservationTypesList();

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
                    className={cn(
                      buttonVariants({ variant: "link", size: "sm" }),
                      "p-0"
                    )}
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
    <Protector>
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 pb-4 pt-1.5 sm:mx-4 sm:px-1">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Reservations
              </h1>
            }
            subtitleText="Search through your rental reservations and view details."
          />
          <Link
            to={addReservationRoute.to}
            search={() => ({ stage: "rental-information" })}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <PlusIconFilled className="mr-2 h-4 w-4" />
            New Reservation
          </Link>
        </div>
        <Separator className="sm:mx-5" />
        <div className="mx-auto my-4 max-w-full px-2 sm:mb-2 sm:mt-6 sm:px-4">
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
                  options: reservationStatusList.data.map((item) => ({
                    value: `${item.id}`,
                    label: item.name,
                  })),
                  defaultValue: [],
                },
                {
                  id: "ReservationTypes",
                  title: "Type",
                  type: "multi-select",
                  options: reservationTypesList.data.map((item) => ({
                    value: `${item.typeName}`,
                    label: item.typeName,
                  })),
                  defaultValue: [],
                },
                {
                  id: "VehicleTypeId",
                  title: "Vehicle type",
                  type: "select",
                  options: vehicleTypesList.data.map((item) => ({
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
                  id: "PickupLocationId",
                  title: "Checkout location",
                  type: "select",
                  options: locationsList.data.data.map((item) => ({
                    value: `${item.locationId}`,
                    label: `${item.locationName}`,
                  })),
                },
                {
                  id: "ReturnLocationId",
                  title: "Checkin location",
                  type: "select",
                  options: locationsList.data.data.map((item) => ({
                    value: `${item.locationId}`,
                    label: `${item.locationName}`,
                  })),
                },
              ],
            }}
          />
        </div>
      </div>
    </Protector>
  );
}

export default ReservationsSearchPage;
