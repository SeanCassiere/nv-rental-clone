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

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
import {
  VehicleSearchQuerySchema,
  type TVehicleListItemParsed,
} from "@/lib/schemas/vehicle";
import { fetchLocationsListOptions } from "@/lib/query/location";
import {
  fetchVehiclesSearchColumnsOptions,
  fetchVehiclesSearchListOptions,
} from "@/lib/query/vehicle";

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
import { sortColOrderByOrderIndex } from "@/lib/utils/columns";
import { getXPaginationFromHeaders } from "@/lib/utils/headers";
import { normalizeVehicleListSearchParams } from "@/lib/utils/normalize-search-params";
import { insertSpacesBeforeCaps } from "@/lib/utils/random";
import { cn } from "@/lib/utils/styles";
import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute("/_auth/(fleet)/fleet/")({
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: search.filters,
  }),
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeVehicleListSearchParams(search);
    return {
      authParams: auth,
      searchColumnsOptions: fetchVehiclesSearchColumnsOptions({ auth }),
      searchListOptions: fetchVehiclesSearchListOptions({
        auth,
        pagination: {
          page: parsedSearch.pageNumber,
          pageSize: parsedSearch.size,
        },
        filters: parsedSearch.searchFilters,
      }),
      search: parsedSearch,
    };
  },
  loader: async ({ context }) => {
    const { queryClient, searchColumnsOptions, searchListOptions } = context;

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    // get columns
    promises.push(queryClient.ensureQueryData(searchColumnsOptions));

    // get search
    promises.push(queryClient.ensureQueryData(searchListOptions));

    await Promise.all(promises);

    return;
  },
  component: VehicleSearchPage,
});

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehicleSearchPage() {
  const navigate = Route.useNavigate();

  const {
    search,
    searchColumnsOptions,
    searchListOptions,
    authParams,
    queryClient,
    vehicleStatusesOptions,
    vehicleTypesOptions,
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

  const vehiclesData = useQuery(searchListOptions);

  const vehicleStatusQuery = useSuspenseQuery(vehicleStatusesOptions);
  const vehicleStatuses = vehicleStatusQuery.data;

  const vehicleTypesQuery = useSuspenseQuery(vehicleTypesOptions);
  const vehicleTypes = vehicleTypesQuery.data;

  const locationsList = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
    })
  );
  const locations =
    locationsList.data?.status === 200 ? locationsList.data.body : [];

  const columnsData = useSuspenseQuery(searchColumnsOptions);

  const columnDefs = React.useMemo(
    () =>
      (columnsData.data.status === 200 ? columnsData.data.body : [])
        .sort(sortColOrderByOrderIndex)
        .map((column) =>
          columnHelper.accessor(
            column.columnHeader as keyof TVehicleListItemParsed,
            {
              id: column.columnHeader,
              meta: {
                columnName: column.columnHeaderDescription ?? "",
              },
              header: () => column.columnHeaderDescription ?? "",
              cell: (item) => {
                const value = item.getValue();
                if (column.columnHeader === "VehicleNo") {
                  const vehicleId = item.table.getRow(item.row.id).original.id;
                  return (
                    <Link
                      to="/fleet/$vehicleId/summary"
                      params={{ vehicleId: String(vehicleId) }}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "p-0 text-base"
                      )}
                    >
                      {value || "-"}
                    </Link>
                  );
                }
                if (column.columnHeader === "VehicleStatus") {
                  return (
                    <Badge variant="outline">
                      {insertSpacesBeforeCaps(String(value))}
                    </Badge>
                  );
                }

                return value ?? "-";
              },
              enableSorting: false,
              enableHiding: column.columnHeader !== "VehicleNo",
            }
          )
        ),
    [columnsData.data]
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
        module: "vehicles",
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
        module: "vehicles",
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
      to: "/fleet",
      params: {},
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
    vehiclesData.status === "success"
      ? vehiclesData.data.pagination
      : getXPaginationFromHeaders(null);

  const tableFacetedFilters: TableListToolbarFilterItem[] = [
    {
      id: "VehicleId",
      title: "Vehicle ID",
      type: "hidden",
    },
    {
      id: "VehicleStatus",
      title: "Status",
      type: "select",
      options: vehicleStatuses.map((item) => ({
        value: `${item.id}`,
        label: insertSpacesBeforeCaps(item.name),
      })),
    },
    {
      id: "VehicleTypeId",
      title: "Type",
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
      id: "OwningLocationId",
      title: "Owning location",
      type: "select",
      options: locations.map((item) => ({
        value: `${item.locationId}`,
        label: `${item.locationName}`,
      })),
    },
    {
      id: "CurrentLocationId",
      title: "Current location",
      type: "select",
      options: locations.map((item) => ({
        value: `${item.locationId}`,
        label: `${item.locationName}`,
      })),
    },
    {
      id: "Active",
      title: "Is active?",
      type: "select",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      defaultValue: "true",
    },
    {
      id: "SortDirection",
      title: "Sort direction",
      type: "select",
      options: [
        { value: "ASC", label: "Asc" },
        { value: "DESC", label: "Desc" },
      ],
      defaultValue: "DESC",
    },
  ];

  const dataList =
    vehiclesData.data?.status === 200 ? vehiclesData.data?.body : [];

  useDocumentTitle(titleMaker("Fleet"));

  return (
    <Container>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl leading-6 font-semibold">Fleet</h1>
        </div>
        <p className={cn("text-foreground/80 text-base")}>
          Search through your fleet and view details.
        </p>
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <TableList
          list={dataList}
          columnDefs={columnDefs}
          isLoading={vehiclesData.isLoading}
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
                    to="/fleet"
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
                    to="/fleet"
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
                    to="/fleet"
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
