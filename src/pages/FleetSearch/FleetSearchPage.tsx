import { useCallback, useMemo } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";

import Protector from "../../components/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import CommonEmptyStateContent from "../../components/Layout/CommonEmptyStateContent";
import { PlusIconFilled, TruckFilled } from "../../components/icons";
import { LinkButton } from "../../components/Form";

import { searchFleetRoute } from "../../routes/fleet/searchFleet";
import { viewFleetByIdRoute } from "../../routes/fleet/fleetIdPath";
import { addFleetRoute } from "../../routes/fleet/addFleet";

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
          header: () => column.columnHeaderDescription,
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "VehicleNo") {
              const vehicleId = item.table.getRow(item.row.id).original.id;
              return (
                <Link
                  to={viewFleetByIdRoute.fullPath}
                  params={{ vehicleId: String(vehicleId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-semibold text-slate-800"
                  preload="intent"
                >
                  {value}
                </Link>
              );
            }

            return value;
          },
        })
      ),
    [columnsData.data]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "vehicles" });

  const handleSaveColumnsOrder = useCallback(
    (newColumnOrder: string[]) => {
      saveColumnsMutation.mutate({
        allColumns: columnsData.data,
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation]
  );

  const handleSaveColumnVisibility = useCallback(
    (graph: ColumnVisibilityGraph) => {
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
        <div className="mx-auto max-w-full px-4 pt-1.5 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                  Fleet
                </h1>
                <div>
                  <LinkButton
                    color="teal"
                    to={addFleetRoute.fullPath}
                    search={() => ({})}
                    className="flex items-center justify-center gap-2"
                  >
                    <PlusIconFilled className="h-4 w-4" />
                    New Vehicle
                  </LinkButton>
                </div>
              </div>
            }
            subtitleText="Search through your fleet and view details."
            includeBottomBorder
          />
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={VehicleFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  to: searchFleetRoute.fullPath,
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
                  to: searchFleetRoute.fullPath,
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

          {vehiclesData.data?.isRequestMade === false ? null : vehiclesData.data
              ?.data.length === 0 ? (
            <CommonEmptyStateContent
              title="No vehicles"
              subtitle="You don't have any vehicles to be shown here."
              icon={
                <TruckFilled className="mx-auto h-12 w-12 text-slate-400" />
              }
            />
          ) : (
            <div>
              <ModuleTable
                data={vehiclesData.data?.data || []}
                columns={columnDefs}
                noRows={
                  vehiclesData.isLoading === false &&
                  vehiclesData.data?.data.length === 0
                }
                onColumnOrderChange={handleSaveColumnsOrder}
                lockedColumns={["VehicleNo"]}
                rawColumnsData={columnsData?.data || []}
                showColumnPicker
                onColumnVisibilityChange={handleSaveColumnVisibility}
                pagination={pagination}
                totalPages={
                  vehiclesData.data?.totalRecords
                    ? Math.ceil(vehiclesData.data?.totalRecords / size) ?? -1
                    : 0
                }
                onPaginationChange={(newPaginationState) => {
                  navigate({
                    to: searchFleetRoute.fullPath,
                    params: {},
                    search: (current) => ({
                      ...current,
                      page: newPaginationState.pageIndex + 1,
                      size: newPaginationState.pageSize,
                    }),
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Protector>
  );
}

export default VehiclesSearchPage;
