import React from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { PrimaryModuleTable } from "@/components/primary-module/table";
import type { PrimaryModuleTableFacetedFilterItem } from "@/components/primary-module/table-filter";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { saveColumnSettings } from "@/lib/api/save-column-settings";
import type { TReservationListItemParsed } from "@/lib/schemas/reservation";
import { fetchLocationsListOptions } from "@/lib/query/location";
import {
  fetchReservationStatusesOptions,
  fetchReservationTypesOptions,
} from "@/lib/query/reservation";
import { fetchVehiclesTypesOptions } from "@/lib/query/vehicle";

import {
  ReservationDateTimeColumns,
  sortColOrderByOrderIndex,
} from "@/lib/utils/columns";
import { titleMaker } from "@/lib/utils/title-maker";

import { cn, getXPaginationFromHeaders } from "@/lib/utils";

const columnHelper = createColumnHelper<TReservationListItemParsed>();

export const Route = createLazyFileRoute("/_auth/reservations/")({
  component: ReservationsSearchPage,
});

const routeApi = getRouteApi("/_auth/reservations/");

function ReservationsSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    searchColumnsOptions,
    searchListOptions,
    search,
    authParams,
    queryClient,
  } = routeApi.useRouteContext();
  const { searchFilters, pageNumber, size } = search;

  const [_trackTableLoading, _setTrackTableLoading] = React.useState(false);

  const startChangingPage = () => {
    _setTrackTableLoading(true);
  };
  const stopChangingPage = () => {
    _setTrackTableLoading(false);
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () =>
      Object.entries(searchFilters).reduce(
        (prev, [key, value]) => [...prev, { id: key, value }],
        [] as ColumnFiltersState
      )
  );

  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
      pageSize: size,
    }),
    [pageNumber, size]
  );

  const reservationsData = useQuery(searchListOptions);

  const reservationStatusList = useQuery(
    fetchReservationStatusesOptions({ auth: authParams })
  );
  const reservationStatuses = React.useMemo(
    () => reservationStatusList.data ?? [],
    [reservationStatusList.data]
  );

  const vehicleTypesList = useQuery(
    fetchVehiclesTypesOptions({ auth: authParams })
  );
  const vehicleTypes = React.useMemo(
    () => vehicleTypesList.data ?? [],
    [vehicleTypesList.data]
  );

  const locationsList = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
    })
  );
  const locations = React.useMemo(
    () => (locationsList.data?.status === 200 ? locationsList.data.body : []),
    [locationsList.data?.body, locationsList.data?.status]
  );

  const reservationTypesList = useQuery(
    fetchReservationTypesOptions({ auth: authParams })
  );
  const reservationTypes = React.useMemo(
    () => reservationTypesList.data ?? [],
    [reservationTypesList.data]
  );

  const columnsData = useSuspenseQuery(searchColumnsOptions);
  const columnDefs = React.useMemo(
    () =>
      (columnsData.data.status === 200 ? columnsData.data.body : [])
        .sort(sortColOrderByOrderIndex)
        .map((column) =>
          columnHelper.accessor(
            column.columnHeader as keyof TReservationListItemParsed,
            {
              id: column.columnHeader,
              header: () => column.columnHeaderDescription ?? "",
              cell: (item) => {
                const value = item.getValue();
                if (column.columnHeader === "ReservationNumber") {
                  const reservationId = item.table.getRow(item.row.id).original
                    .id;
                  return (
                    <Link
                      to="/reservations/$reservationId"
                      params={{ reservationId: String(reservationId) }}
                      search={() => ({ tab: "summary" })}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "p-0 text-base"
                      )}
                    >
                      {value || "-"}
                    </Link>
                  );
                }
                if (column.columnHeader === "ReservationStatusName") {
                  return <Badge variant="outline">{value}</Badge>;
                }

                if (
                  ReservationDateTimeColumns.includes(column.columnHeader) &&
                  value &&
                  typeof value !== "boolean"
                ) {
                  return t("intlDateTime", {
                    value: new Date(value),
                    ns: "format",
                  });
                }

                return value ?? "-";
              },
              enableSorting: false,
              enableHiding: column.columnHeader !== "ReservationNumber",
            }
          )
        ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useMutation({
    mutationFn: saveColumnSettings,
    onMutate: () =>
      queryClient.cancelQueries({ queryKey: searchColumnsOptions.queryKey }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: searchColumnsOptions.queryKey,
      }),
    onError: () =>
      queryClient.invalidateQueries({
        queryKey: searchColumnsOptions.queryKey,
      }),
  });

  const handleSaveColumnsOrder = React.useCallback(
    (newColumnOrder: ColumnOrderState) => {
      saveColumnsMutation.mutate({
        auth: authParams,
        module: "reservations",
        allColumns:
          columnsData.data.status === 200 ? columnsData.data.body : [],
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation, authParams]
  );

  const handleSaveColumnVisibility = React.useCallback(
    (graph: VisibilityState) => {
      const newColumnsData = (
        columnsData.data.status === 200 ? columnsData.data.body : []
      ).map((col) => {
        col.isSelected = graph[col.columnHeader] || false;
        return col;
      });
      saveColumnsMutation.mutate({
        auth: authParams,
        module: "reservations",
        allColumns: newColumnsData,
      });
    },
    [columnsData.data, saveColumnsMutation, authParams]
  );

  const parsedPagination =
    reservationsData.status === "success"
      ? reservationsData.data.pagination
      : getXPaginationFromHeaders(null);

  const tableFacetedFilters: PrimaryModuleTableFacetedFilterItem[] =
    React.useMemo(
      () => [
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
            value: `${item.id}`,
            label: item.value,
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
      [locations, reservationStatuses, reservationTypes, vehicleTypes]
    );

  const dataList = React.useMemo(
    () =>
      reservationsData.data?.status === 200 ? reservationsData.data?.body : [],
    [reservationsData.data?.body, reservationsData.data?.status]
  );

  useDocumentTitle(titleMaker("Reservations"));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <h1 className="text-2xl font-semibold leading-6">Reservations</h1>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to="/reservations/new"
              search={() => ({ stage: "rental-information" })}
              className={cn(buttonVariants({ size: "sm" }), "w-max")}
            >
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>New Reservation</span>
            </Link>
          </div>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Search through your bookings and view details.
        </p>
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <PrimaryModuleTable
          data={dataList}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          isLoading={reservationsData.isLoading || _trackTableLoading}
          initialColumnVisibility={
            columnsData.data.status === 200
              ? columnsData.data.body.reduce(
                  (prev, current) => ({
                    ...prev,
                    [current.columnHeader]: current.isSelected,
                  }),
                  {}
                )
              : {}
          }
          onColumnVisibilityChange={handleSaveColumnVisibility}
          totalPages={
            parsedPagination?.totalRecords
              ? Math.ceil(parsedPagination?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            startChangingPage();
            navigate({
              to: "/reservations",
              params: {},
              search: (current) => ({
                ...current,
                page: newPaginationState.pageIndex + 1,
                size: newPaginationState.pageSize,
                filters: searchFilters,
              }),
            }).then(stopChangingPage);
          }}
          filters={{
            columnFilters,
            setColumnFilters,
            onClearFilters: () => {
              startChangingPage();
              navigate({
                to: "/reservations",
                params: {},
                search: () => ({
                  page: 1,
                  size: pagination.pageSize,
                }),
              }).then(stopChangingPage);
            },
            onSearchWithFilters: () => {
              const filters = columnFilters.reduce(
                (prev, current) => ({
                  ...prev,
                  [current.id]: current.value,
                }),
                {}
              );
              startChangingPage();
              navigate({
                to: "/reservations",
                params: {},
                search: () => ({
                  page: 1,
                  size: pagination.pageSize,
                  filters,
                }),
              }).then(stopChangingPage);
            },
            filterableColumns: tableFacetedFilters,
          }}
        />
      </section>
    </>
  );
}
