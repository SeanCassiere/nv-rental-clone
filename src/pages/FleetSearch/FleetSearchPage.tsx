import { useCallback, useMemo, useState } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/router";
import {
  createColumnHelper,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import Protector from "@/components/Protector";
import CommonHeader from "@/components/Layout/CommonHeader";

import { searchFleetRoute } from "@/routes/fleet/searchFleet";
import { viewFleetByIdRoute } from "@/routes/fleet/fleetIdPath";

import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetVehicleStatusList } from "@/hooks/network/vehicle/useGetVehicleStatusList";
import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
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
import { sortColOrderByOrderIndex } from "@/utils/ordering";
import { normalizeVehicleListSearchParams } from "@/utils/normalize-search-params";
import type { TVehicleListItemParsed } from "@/schemas/vehicle";
import { titleMaker } from "@/utils/title-maker";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehiclesSearchPage() {
  const navigate = useNavigate({ from: searchFleetRoute.id });

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
  const vehicleTypesList = useGetVehicleTypesList();
  const locationsList = useGetLocationsList({ locationIsActive: true });

  const columnsData = useGetModuleColumns({ module: "vehicles" });

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
            if (column.columnHeader === "VehicleNo") {
              const vehicleId = item.table.getRow(item.row.id).original.id;
              return (
                <PrimaryModuleTableCellWrap>
                  <Link
                    to={viewFleetByIdRoute.to}
                    params={{ vehicleId: String(vehicleId) }}
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

  useDocumentTitle(titleMaker("Fleet"));

  return (
    <Protector>
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 pb-4 pt-1.5 sm:mx-4 sm:px-1">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Fleet
              </h1>
            }
            subtitleText="Search through your fleet and view details."
          />
        </div>
        <Separator className="sm:mx-5" />
        <div className="mx-auto my-4 max-w-full px-2 sm:mb-2 sm:mt-6 sm:px-4">
          <PrimaryModuleTable
            data={vehiclesData.data?.data || []}
            columns={columnDefs}
            onColumnOrderChange={handleSaveColumnsOrder}
            rawColumnsData={columnsData?.data || []}
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
                  options: vehicleStatusList.data.map((item) => ({
                    value: `${item.id}`,
                    label: item.name,
                  })),
                },
                {
                  id: "VehicleTypeId",
                  title: "Type",
                  type: "select",
                  options: vehicleTypesList.data.map((item) => ({
                    value: `${item.VehicleTypeId}`,
                    label: item.VehicleTypeName,
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
                  options: locationsList.data.data.map((item) => ({
                    value: `${item.locationId}`,
                    label: `${item.locationName}`,
                  })),
                },
                {
                  id: "CurrentLocationId",
                  title: "Current location",
                  type: "select",
                  options: locationsList.data.data.map((item) => ({
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
        </div>
      </div>
    </Protector>
  );
}

export default VehiclesSearchPage;
