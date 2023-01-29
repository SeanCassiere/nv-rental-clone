import { useCallback, useEffect, useMemo } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import Protector from "../../components/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import CommonEmptyStateContent from "../../components/Layout/CommonEmptyStateContent";
import { TruckFilled } from "../../components/icons";

import { searchVehiclesRoute } from "../../routes/vehicles/searchVehicles";
import { viewVehicleRoute } from "../../routes/vehicles/viewVehicle";

import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { useGetVehicleStatusList } from "../../hooks/network/vehicle/useGetVehicleStatusList";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";

import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { normalizeVehicleListSearchParams } from "../../utils/normalize-search-params";
import type { TVehicleListItemParsed } from "../../utils/schemas/vehicle";
import { VehicleFiltersSchema } from "../../utils/schemas/vehicle";
import { titleMaker } from "../../utils/title-maker";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehiclesSearchPage() {
  const navigate = useNavigate({ from: searchVehiclesRoute.id });

  const search = useSearch({ from: searchVehiclesRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeVehicleListSearchParams(search);

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
                  to={viewVehicleRoute.id}
                  params={{ vehicleId: String(vehicleId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-medium text-slate-800"
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

  useEffect(() => {
    document.title = titleMaker("Vehicles");
  }, []);

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 pt-1.5 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Vehicles
              </h1>
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
                  to: "/vehicles",
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
                  to: "/vehicles",
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

          {vehiclesData.data.isRequestMade === false ? null : vehiclesData.data
              .data.length === 0 ? (
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
                key={`table-cols-${columnDefs.length}`}
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
              />
            </div>
          )}

          {vehiclesData.data.isRequestMade === false ? null : vehiclesData.data
              .data.length === 0 ? null : (
            <div>
              <p>
                <Link
                  to="/vehicles"
                  search={(search) => ({
                    ...search,
                    page: pageNumber === 1 ? 1 : pageNumber - 1,
                    size,
                  })}
                  preload="intent"
                  disabled={pageNumber === 1}
                >
                  less
                </Link>
                &nbsp;|&nbsp;
                <Link
                  to="/vehicles"
                  search={(search) => ({
                    ...search,
                    page:
                      pageNumber === vehiclesData.data?.totalPages
                        ? pageNumber
                        : pageNumber + 1,
                    size,
                  })}
                  preload="intent"
                  disabled={pageNumber === vehiclesData.data?.totalPages}
                >
                  plus
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </Protector>
  );
}

export default VehiclesSearchPage;
