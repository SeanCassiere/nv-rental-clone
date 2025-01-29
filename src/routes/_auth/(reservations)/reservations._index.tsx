import React from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationLinkNext,
  PaginationLinkPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { saveColumnSettings } from "@/lib/api/save-column-settings";
import { ReservationSearchQuerySchema } from "@/lib/schemas/reservation";
import type { TReservationListItemParsed } from "@/lib/schemas/reservation";
import { fetchLocationsListOptions } from "@/lib/query/location";
import {
  fetchReservationsSearchColumnsOptions,
  fetchReservationsSearchListOptions,
} from "@/lib/query/reservation";
import { fetchVehiclesTypesOptions } from "@/lib/query/vehicle";

import {
  TableList,
  TableListColumnVisibilityDropdown,
  TableListContent,
  TableListPaginationItems,
  TableListPaginationNext,
  TableListPaginationPrevious,
  TableListToolbar,
  TableListToolbarActions,
  TableListToolbarFilters,
  type TableListToolbarFilterItem,
} from "@/routes/_auth/-modules/table-list";
import { Container } from "@/routes/-components/container";

import { getAuthFromRouterContext } from "@/lib/utils/auth";
import {
  ReservationDateTimeColumns,
  sortColOrderByOrderIndex,
} from "@/lib/utils/columns";
import { STORAGE_DEFAULTS } from "@/lib/utils/constants";
import { getXPaginationFromHeaders } from "@/lib/utils/headers";
import { normalizeReservationListSearchParams } from "@/lib/utils/normalize-search-params";
import { insertSpacesBeforeCaps } from "@/lib/utils/random";
import { cn } from "@/lib/utils/styles";
import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute("/_auth/(reservations)/reservations/")({
  validateSearch: (search) => ReservationSearchQuerySchema.parse(search),
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: search.filters,
  }),
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeReservationListSearchParams(search);
    return {
      authParams: auth,
      searchColumnsOptions: fetchReservationsSearchColumnsOptions({ auth }),
      searchListOptions: fetchReservationsSearchListOptions({
        auth,
        pagination: {
          page: parsedSearch.pageNumber,
          pageSize: parsedSearch.size,
        },
        filters: { ...parsedSearch.searchFilters, clientDate: new Date() },
      }),
      search: parsedSearch,
    };
  },
  loader: async ({ context }) => {
    const { queryClient, searchListOptions, searchColumnsOptions } = context;

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    // get columns
    promises.push(queryClient.ensureQueryData(searchColumnsOptions));

    // get search
    promises.push(queryClient.ensureQueryData(searchListOptions));

    await Promise.all(promises);

    return;
  },
  component: ReservationsSearchPage,
});

const columnHelper = createColumnHelper<TReservationListItemParsed>();

function ReservationsSearchPage() {
  const { t } = useTranslation();

  const navigate = Route.useNavigate();

  const {
    searchColumnsOptions,
    searchListOptions,
    search,
    authParams,
    queryClient,
    reservationStatusesOptions,
    reservationTypesOptions,
  } = Route.useRouteContext();
  const { searchFilters, pageNumber, size } = search;

  const [columnFilters, handleColumnFiltersChange] =
    React.useState<ColumnFiltersState>(() =>
      Object.entries(searchFilters).reduce(
        (prev, [key, value]) => [...prev, { id: key, value }],
        [] as ColumnFiltersState
      )
    );

  const pagination: PaginationState = {
    pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
    pageSize: size,
  };

  const reservationsData = useQuery(searchListOptions);

  const reservationStatusQuery = useSuspenseQuery(reservationStatusesOptions);
  const reservationStatuses = reservationStatusQuery.data;

  const vehicleTypesList = useQuery(
    fetchVehiclesTypesOptions({ auth: authParams })
  );
  const vehicleTypes = vehicleTypesList.data ?? [];

  const locationsList = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
    })
  );
  const locations =
    locationsList.data?.status === 200 ? locationsList.data.body : [];

  const reservationTypesQuery = useSuspenseQuery(reservationTypesOptions);
  const reservationTypes = reservationTypesQuery.data;

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
              meta: {
                columnName: column.columnHeaderDescription ?? "",
              },
              header: () => column.columnHeaderDescription ?? "",
              cell: (item) => {
                const value = item.getValue();
                if (column.columnHeader === "ReservationNumber") {
                  const reservationId = item.table.getRow(item.row.id).original
                    .id;
                  return (
                    <Link
                      to="/reservations/$reservationId/summary"
                      params={{ reservationId: String(reservationId) }}
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
                  return (
                    <Badge variant="outline">
                      {insertSpacesBeforeCaps(String(value))}
                    </Badge>
                  );
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

  const handleColumnOrderChange = React.useCallback(
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

  const handleColumnVisibilityChange = React.useCallback(
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

  const handleClearFilters = React.useCallback(() => {
    navigate({
      search: () => ({
        page: 1,
        size: pagination.pageSize,
      }),
    });
  }, [navigate, pagination.pageSize]);

  const handleSearchFilters = React.useCallback(() => {
    const filters = columnFilters.reduce(
      (prev, current) => ({
        ...prev,
        [current.id]: current.value,
      }),
      {}
    );
    navigate({
      search: () => ({
        page: 1,
        size: pagination.pageSize,
        filters,
      }),
    });
  }, [columnFilters, navigate, pagination.pageSize]);

  const columnVisibility: VisibilityState =
    columnsData.data.status === 200
      ? columnsData.data.body.reduce(
          (prev, current) => ({
            ...prev,
            [current.columnHeader]: current.isSelected,
          }),
          {}
        )
      : {};

  const parsedPagination =
    reservationsData.status === "success"
      ? reservationsData.data.pagination
      : getXPaginationFromHeaders(null);

  const tableFacetedFilters: TableListToolbarFilterItem[] = [
    {
      id: "CustomerId",
      title: "CustomerId",
      type: "hidden",
    },
    {
      id: "VehicleId",
      title: "VehicleId",
      type: "hidden",
    },
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
        label: insertSpacesBeforeCaps(item.name),
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
      id: "VehicleNo",
      title: "Vehicle no.",
      type: "text",
      size: "normal",
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
    {
      id: "SortDirection",
      title: "Sort direction",
      type: "select",
      options: [
        { value: "ASC", label: "Asc" },
        { value: "DESC", label: "Desc" },
      ],
      defaultValue: "ASC",
    },
  ];

  const dataList =
    reservationsData.data?.status === 200 ? reservationsData.data?.body : [];

  useDocumentTitle(titleMaker("Reservations"));

  return (
    <Container>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <h1 className="text-2xl leading-6 font-semibold">Reservations</h1>
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
        <p className={cn("text-foreground/80 text-base")}>
          Search through your bookings and view details.
        </p>
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <TableList
          list={dataList}
          columnDefs={columnDefs}
          isLoading={reservationsData.isLoading}
          filtering={{
            columnFilters,
            onColumnFiltersChange: handleColumnFiltersChange,
          }}
          visibility={{
            columnVisibility,
            onColumnVisibilityChange: handleColumnVisibilityChange,
          }}
          ordering={{
            onColumnOrderChange: handleColumnOrderChange,
          }}
          pagination={{
            pagination,
            totalPages: parsedPagination.totalRecords
              ? (Math.ceil(parsedPagination?.totalRecords / size) ?? -1)
              : 0,
          }}
        >
          <TableListToolbar
            filterItems={tableFacetedFilters}
            onSearchWithFilters={handleSearchFilters}
            onClearFilters={handleClearFilters}
            className="flex flex-wrap items-start justify-start gap-2"
          >
            <TableListToolbarFilters />
            <TableListToolbarActions className="inline-flex justify-start gap-2" />
          </TableListToolbar>
          <Separator className="my-4" />
          <div className="flex items-center justify-end">
            <TableListColumnVisibilityDropdown />
          </div>
          <div className="bg-card mt-2.5 overflow-hidden rounded-md border">
            <TableListContent />
          </div>
          <Pagination className="mt-2.5">
            <PaginationContent className="bg-card rounded-md border px-1 py-0.5 md:px-2 md:py-1">
              <TableListPaginationPrevious>
                {(state) => (
                  <PaginationLinkPrevious
                    disabled={state.disabled}
                    className={cn(
                      state.disabled ? "cursor-not-allowed opacity-60" : ""
                    )}
                    to="/reservations"
                    search={(prev) => ({
                      ...prev,
                      page: state.pagination.pageIndex + 1,
                      size: state.pagination.pageSize,
                      filters: searchFilters,
                    })}
                  />
                )}
              </TableListPaginationPrevious>

              <TableListPaginationItems className="hidden sm:inline-block">
                {({ pagination, isActive }) => (
                  <PaginationLink
                    to="/reservations"
                    search={(prev) => ({
                      ...prev,
                      page: pagination.pageIndex + 1,
                      size: pagination.pageSize,
                      filters: searchFilters,
                    })}
                    isActive={isActive}
                  >
                    {pagination.pageIndex + 1}
                  </PaginationLink>
                )}
              </TableListPaginationItems>

              <TableListPaginationNext>
                {(state) => (
                  <PaginationLinkNext
                    disabled={state.disabled}
                    className={cn(
                      state.disabled ? "cursor-not-allowed opacity-60" : ""
                    )}
                    to="/reservations"
                    search={(prev) => ({
                      ...prev,
                      page: state.pagination.pageIndex + 1,
                      size: state.pagination.pageSize,
                      filters: searchFilters,
                    })}
                  />
                )}
              </TableListPaginationNext>
            </PaginationContent>
          </Pagination>
        </TableList>
      </section>
    </Container>
  );
}
