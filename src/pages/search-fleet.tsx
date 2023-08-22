import { useCallback, useMemo, useState } from "react";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import {
  PrimaryModuleTable,
  PrimaryModuleTableCellWrap,
  PrimaryModuleTableColumnHeader,
} from "@/components/primary-module/table";
import ProtectorShield from "@/components/protector-shield";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetVehicleTypesLookupList } from "@/hooks/network/vehicle-type/useGetVehicleTypesLookup";
import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";
import { useGetVehicleStatusList } from "@/hooks/network/vehicle/useGetVehicleStatusList";

import { viewFleetByIdRoute } from "@/routes/fleet/fleet-id-route";
import { searchFleetRoute } from "@/routes/fleet/search-fleet-route";

import type { TVehicleListItemParsed } from "@/schemas/vehicle";

import { normalizeVehicleListSearchParams } from "@/utils/normalize-search-params";
import { sortColOrderByOrderIndex } from "@/utils/ordering";
import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehiclesSearchPage() {
  const navigate = useNavigate();

  const search = useSearch({ from: searchFleetRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeVehicleListSearchParams(search);

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

  const vehiclesData = useGetVehiclesList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const vehicleStatusList = useGetVehicleStatusList();
  const vehicleStatuses = vehicleStatusList.data ?? [];

  const vehicleTypesList = useGetVehicleTypesLookupList();
  const vehicleTypes = vehicleTypesList.data ?? [];

  const locationsList = useGetLocationsList({ locationIsActive: true });
  const locations =
    locationsList.data?.status === 200 ? locationsList.data.body : [];

  const columnsData = useGetModuleColumns({ module: "vehicles" });

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
                      to={viewFleetByIdRoute.to}
                      params={{ vehicleId: String(vehicleId) }}
                      search={() => ({ tab: "summary" })}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "p-0 text-base"
                      )}
                      preload="intent"
                    >
                      {value}
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

  const saveColumnsMutation = useSaveModuleColumns({ module: "vehicles" });

  const handleSaveColumnsOrder = useCallback(
    (newColumnOrder: ColumnOrderState) => {
      saveColumnsMutation.mutate({
        allColumns:
          columnsData.data.status === 200 ? columnsData.data.body : [],
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation]
  );

  const handleSaveColumnVisibility = useCallback(
    (graph: VisibilityState) => {
      const newColumnsData = (
        columnsData.data.status === 200 ? columnsData.data.body : []
      ).map((col) => {
        col.isSelected = graph[col.columnHeader] || false;
        return col;
      });
      saveColumnsMutation.mutate({ allColumns: newColumnsData });
    },
    [columnsData.data, saveColumnsMutation]
  );

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
        <Separator className="mt-3.5" />
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <PrimaryModuleTable
          data={vehiclesData.data?.data || []}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          rawColumnsData={
            columnsData.data.status === 200 ? columnsData.data.body : []
          }
          onColumnVisibilityChange={handleSaveColumnVisibility}
          totalPages={
            vehiclesData.data?.totalRecords
              ? Math.ceil(vehiclesData.data?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            navigate({
              to: searchFleetRoute.to,
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
                to: searchFleetRoute.to,
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
                to: searchFleetRoute.to,
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
