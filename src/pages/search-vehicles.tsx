import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, RouteApi, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  PrimaryModuleTable,
  PrimaryModuleTableCellWrap,
  PrimaryModuleTableColumnHeader,
} from "@/components/primary-module/table";
import ProtectorShield from "@/components/protector-shield";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { saveColumnSettings } from "@/api/save-column-settings";

import type { TVehicleListItemParsed } from "@/schemas/vehicle";

import { sortColOrderByOrderIndex } from "@/utils/ordering";
import { fetchLocationsListOptions } from "@/utils/query/location";
import {
  fetchVehiclesStatusesOptions,
  fetchVehiclesTypesOptions,
} from "@/utils/query/vehicle";
import { titleMaker } from "@/utils/title-maker";

import { cn, getXPaginationFromHeaders } from "@/utils";

const routeApi = new RouteApi({ id: "/fleet/" });

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehiclesSearchPage() {
  const navigate = useNavigate();

  const {
    search,
    searchColumnsOptions,
    searchListOptions,
    authParams,
    queryClient,
  } = routeApi.useRouteContext();
  const { searchFilters, pageNumber, size } = search;

  const [_trackTableLoading, _setTrackTableLoading] = useState(false);

  const startChangingPage = () => {
    _setTrackTableLoading(true);
  };
  const stopChangingPage = () => {
    _setTrackTableLoading(false);
  };

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

  const vehiclesData = useQuery(searchListOptions);

  const vehicleStatusList = useQuery(
    fetchVehiclesStatusesOptions({ auth: authParams })
  );
  const vehicleStatuses = vehicleStatusList.data ?? [];

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

  const columnsData = useSuspenseQuery(searchColumnsOptions);

  const columnDefs = useMemo(
    () =>
      (columnsData.data.status === 200 ? columnsData.data.body : [])
        .sort(sortColOrderByOrderIndex)
        .map((column) =>
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
              if (column.columnHeader === "VehicleNo") {
                const vehicleId = item.table.getRow(item.row.id).original.id;
                return (
                  <PrimaryModuleTableCellWrap>
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
                  </PrimaryModuleTableCellWrap>
                );
              }
              if (column.columnHeader === "VehicleStatus") {
                return (
                  <PrimaryModuleTableCellWrap>
                    <Badge variant="outline">{value}</Badge>
                  </PrimaryModuleTableCellWrap>
                );
              }

              return (
                <PrimaryModuleTableCellWrap>{value}</PrimaryModuleTableCellWrap>
              );
            },
            enableHiding: column.columnHeader !== "VehicleNo",
            enableSorting: false,
          })
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

  const handleSaveColumnsOrder = useCallback(
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

  const handleSaveColumnVisibility = useCallback(
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

  const parsedPagination =
    vehiclesData.status === "success"
      ? vehiclesData.data.pagination
      : getXPaginationFromHeaders(null);

  const vehiclesList =
    vehiclesData.data?.status === 200 ? vehiclesData.data?.body : [];

  useDocumentTitle(titleMaker("Fleet"));

  return (
    <ProtectorShield>
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
        <PrimaryModuleTable
          data={vehiclesList}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          rawColumnsData={
            columnsData.data.status === 200 ? columnsData.data.body : []
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
            filterableColumns: [
              {
                id: "VehicleStatus",
                title: "Status",
                type: "select",
                options: vehicleStatuses.map((item) => ({
                  value: `${item.id}`,
                  label: item.name,
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
            ],
          }}
        />
      </section>
    </ProtectorShield>
  );
}

export default VehiclesSearchPage;
