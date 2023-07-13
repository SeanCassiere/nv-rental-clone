import { useCallback, useMemo } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/router";
import {
  createColumnHelper,
  type PaginationState,
  type VisibilityState,
  type ColumnOrderState,
} from "@tanstack/react-table";

import Protector from "../../components/Protector";
import {
  ModuleTable,
  ModuleTableColumnHeader,
  ModuleTableCellWrap,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";

import { searchFleetRoute } from "../../routes/fleet/searchFleet";
import { viewFleetByIdRoute } from "../../routes/fleet/fleetIdPath";

import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { useGetVehicleStatusList } from "../../hooks/network/vehicle/useGetVehicleStatusList";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { normalizeVehicleListSearchParams } from "../../utils/normalize-search-params";
import type { TVehicleListItemParsed } from "../../utils/schemas/vehicle";
import { VehicleFiltersSchema } from "../../utils/schemas/vehicle";
import { titleMaker } from "../../utils/title-maker";
import { cn } from "@/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehiclesSearchPage() {
  const navigate = useNavigate({ from: searchFleetRoute.id });

  const search = useSearch({ from: searchFleetRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeVehicleListSearchParams(search);

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
            <ModuleTableColumnHeader
              column={columnChild}
              title={column.columnHeaderDescription ?? ""}
            />
          ),
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "VehicleNo") {
              const vehicleId = item.table.getRow(item.row.id).original.id;
              return (
                <ModuleTableCellWrap>
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
                </ModuleTableCellWrap>
              );
            }
            if (column.columnHeader === "VehicleStatus") {
              return (
                <ModuleTableCellWrap>
                  <Badge variant="outline">{value}</Badge>
                </ModuleTableCellWrap>
              );
            }

            return <ModuleTableCellWrap>{value}</ModuleTableCellWrap>;
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
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 py-4 sm:px-4">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Fleet
              </h1>
            }
            subtitleText="Search through your fleet and view details."
            includeBottomBorder
          />
        </div>
        <div className="mx-auto max-w-full px-2 sm:px-4">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={VehicleFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  to: searchFleetRoute.to,
                  params: {},
                  search: (current) => ({
                    ...current,
                    page: 1,
                    size: 10,
                    filters: { ...formValues },
                  }),
                });
              }}
              onReset={async () => {
                navigate({
                  to: searchFleetRoute.to,
                  params: {},
                  search: () => ({ page: 1, size: 10, filters: undefined }),
                });
              }}
              searchFiltersBlueprint={[
                {
                  queryKey: "VehicleStatus",
                  type: "single-dropdown",
                  required: false,
                  accessor: "VehicleStatus",
                  label: "Fleet status",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...vehicleStatusList.data.map((item) => ({
                      value: `${item.id}`,
                      label: item.name,
                    })),
                  ],
                },
                {
                  queryKey: "VehicleTypeId",
                  type: "single-dropdown",
                  required: false,
                  accessor: "VehicleTypeId",
                  label: "Vehicle type",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...vehicleTypesList.data.map((item) => ({
                      value: `${item.VehicleTypeId}`,
                      label: item.VehicleTypeName,
                    })),
                  ],
                },
                {
                  queryKey: "VehicleNo",
                  type: "text",
                  required: false,
                  accessor: "VehicleNo",
                  label: "Vehicle no.",
                },
                {
                  queryKey: "PickupLocationId",
                  type: "single-dropdown",
                  required: false,
                  accessor: "OwningLocationId",
                  label: "Owning location",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...locationsList.data.data.map((item) => ({
                      value: `${item.locationId}`,
                      label: `${item.locationName}`,
                    })),
                  ],
                },
                {
                  queryKey: "ReturnLocationId",
                  type: "single-dropdown",
                  required: false,
                  accessor: "CurrentLocationId",
                  label: "Current location",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...locationsList.data.data.map((item) => ({
                      value: `${item.locationId}`,
                      label: `${item.locationName}`,
                    })),
                  ],
                },
                {
                  queryKey: "VehicleId",
                  type: "hidden",
                  required: false,
                  accessor: "VehicleId",
                  label: "VehicleId",
                },
                {
                  queryKey: "Active",
                  type: "single-dropdown",
                  required: false,
                  accessor: "Active",
                  label: "Active",
                  options: [
                    { value: "true", label: "true", isPlaceholder: true },
                    { value: "false", label: "false" },
                  ],
                },
                {
                  queryKey: "SortDirection",
                  type: "single-dropdown",
                  required: false,
                  accessor: "SortDirection",
                  label: "Sort direction",
                  options: [
                    { value: "ASC", label: "ASC" },
                    { value: "DESC", label: "DESC", isPlaceholder: true },
                  ],
                },
              ]}
            />
          </div>

          <ModuleTable
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
          />
        </div>
      </div>
    </Protector>
  );
}

export default VehiclesSearchPage;
