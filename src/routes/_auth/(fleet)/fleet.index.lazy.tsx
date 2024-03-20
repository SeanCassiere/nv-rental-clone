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
import type { TVehicleListItemParsed } from "@/lib/schemas/vehicle";
import { fetchLocationsListOptions } from "@/lib/query/location";
import {
  fetchVehiclesStatusesOptions,
  fetchVehiclesTypesOptions,
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

import { sortColOrderByOrderIndex } from "@/lib/utils/columns";
import { getXPaginationFromHeaders } from "@/lib/utils/headers";
import { insertSpacesBeforeCaps } from "@/lib/utils/random";
import { cn } from "@/lib/utils/styles";
import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute("/_auth/(fleet)/fleet/")({
  component: VehicleSearchPage,
});

const routeApi = getRouteApi("/_auth/fleet/");

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehicleSearchPage() {
  const navigate = useNavigate();

  const {
    search,
    searchColumnsOptions,
    searchListOptions,
    authParams,
    queryClient,
  } = routeApi.useRouteContext();
  const { searchFilters, pageNumber, size } = search;

  const [columnFilters, handleColumnFiltersChange] =
    React.useState<ColumnFiltersState>(() =>
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

  const vehiclesData = useQuery(searchListOptions);

  const vehicleStatusList = useQuery(
    fetchVehiclesStatusesOptions({ auth: authParams })
  );
  const vehicleStatuses = React.useMemo(
    () => vehicleStatusList.data ?? [],
    [vehicleStatusList.data]
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
                      to="/fleet/$vehicleId"
                      params={{ vehicleId: String(vehicleId) }}
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
      to: "/fleet",
      params: {},
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

  const columnVisibility: VisibilityState = React.useMemo(
    () =>
      columnsData.data.status === 200
        ? columnsData.data.body.reduce(
            (prev, current) => ({
              ...prev,
              [current.columnHeader]: current.isSelected,
            }),
            {}
          )
        : {},
    [columnsData.data?.body, columnsData.data?.status]
  );

  const parsedPagination =
    vehiclesData.status === "success"
      ? vehiclesData.data.pagination
      : getXPaginationFromHeaders(null);

  const tableFacetedFilters: TableListToolbarFilterItem[] = React.useMemo(
    () => [
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
    ],
    [locations, vehicleStatuses, vehicleTypes]
  );

  const dataList = React.useMemo(
    () => (vehiclesData.data?.status === 200 ? vehiclesData.data?.body : []),
    [vehiclesData.data?.body, vehiclesData.data?.status]
  );

  useDocumentTitle(titleMaker("Fleet"));

  return (
    <Container>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6">Fleet</h1>
        </div>
        <p className={cn("text-base text-foreground/80")}>
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
              ? Math.ceil(parsedPagination?.totalRecords / size) ?? -1
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
          <div className="mt-2.5 overflow-hidden rounded-md border bg-card">
            <TableListContent />
          </div>
          <Pagination className="mt-2.5">
            <PaginationContent className="rounded-md border bg-card px-1 py-0.5 md:px-2 md:py-1">
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

      {/* <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <PrimaryModuleTable
          data={dataList}
          columns={columnDefs}
          onColumnOrderChange={handleColumnsOrderChange}
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
          onColumnVisibilityChange={handleColumnVisibilityChange}
          totalPages={
            parsedPagination?.totalRecords
              ? Math.ceil(parsedPagination?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            startChangingPage();
            navigate({
              to: "/fleet",
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
                to: "/fleet",
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
                to: "/fleet",
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
      </section> */}
    </Container>
  );
}
