import { useCallback, useEffect, useMemo } from "react";
import { Link, useSearch, useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { searchVehiclesRoute } from "../../routes/vehicles/searchVehicles";
import Protector from "../../components/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";

import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { VehicleFiltersSchema } from "../../utils/schemas/vehicle";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { useGetVehicleStatusList } from "../../hooks/network/vehicle/useGetVehicleStatusList";
import type { TVehicleListItemParsed } from "../../utils/schemas/vehicle";
import { normalizeVehicleListSearchParams } from "../../utils/normalize-search-params";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";
import { viewVehicleRoute } from "../../routes/vehicles/viewVehicle";
import { titleMaker } from "../../utils/title-maker";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

function VehiclesSearchPage() {
  const router = useRouter();

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
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-gray-700">
            Vehicles
          </h2>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={VehicleFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                router.navigate({
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
                router.navigate({
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
                  label: "Status",
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
                    ...locationsList.data.map((item) => ({
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
                    ...locationsList.data.map((item) => ({
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
              >
                plus
              </Link>
            </p>
            <p>
              {JSON.stringify({
                totalPages: vehiclesData.data?.totalPages,
                totalRecords: vehiclesData.data?.totalRecords,
              })}
            </p>
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default VehiclesSearchPage;
