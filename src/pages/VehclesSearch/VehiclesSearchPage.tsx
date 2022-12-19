import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { vehicleFiltersModel } from "../../utils/schemas/vehicle";
import type { VehicleListItemType } from "../../types/Vehicle";
import { sortColOrderByOrderIndex } from "../../utils/ordering";

const columnHelper = createColumnHelper<VehicleListItemType>();

function VehiclesSearchPage() {
  const { page: pageNumber = 1, size = 10, filters } = useSearch();
  const searchFilters = {
    Active: typeof filters?.Active !== "undefined" ? filters?.Active : true,
    SortDirection: filters?.SortDirection || "DESC",
  };

  const vehiclesData = useGetVehiclesList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const columnsData = useGetModuleColumns({ module: "vehicles" });

  const columnDefs = columnsData.data
    .sort(sortColOrderByOrderIndex)
    .map((column) =>
      columnHelper.accessor(column.columnHeader as any, {
        id: column.columnHeader,
        header: () => column.columnHeaderDescription,
        cell: (item) => {
          if (column.columnHeader === "VehicleNo") {
            const vehicleId = item.table.getRow(item.row.id).original.id;
            return (
              <Link
                to="/agreements/$agreementId"
                params={{ agreementId: String(vehicleId) }}
                className="font-medium text-teal-700"
              >
                {item.getValue()}
              </Link>
            );
          }

          return item.getValue();
        },
      })
    );

  const saveColumnsMutation = useSaveModuleColumns({ module: "vehicles" });

  const handleSaveColumnsOrder = (newColumnOrder: string[]) => {
    saveColumnsMutation.mutate({
      allColumns: columnsData.data,
      accessorKeys: newColumnOrder,
    });
  };

  const handleSaveColumnVisibility = (graph: ColumnVisibilityGraph) => {
    const newColumnsData = columnsData.data.map((col) => {
      col.isSelected = graph[col.columnHeader] || false;
      return col;
    });
    saveColumnsMutation.mutate({ allColumns: newColumnsData });
  };

  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div className="my-2 py-4">
              <ModuleSearchFilters
                key={`module-filters-${JSON.stringify(searchFilters).length}`}
                validationSchema={vehicleFiltersModel}
                initialValues={searchFilters}
                searchFiltersBlueprint={[
                  {
                    name: "Active",
                    type: "single-dropdown",
                    required: false,
                    accessor: "Active",
                    label: "Active",
                    options: [
                      { value: "true", label: "true" },
                      { value: "false", label: "false" },
                    ],
                  },
                  {
                    name: "SortDirection",
                    type: "single-dropdown",
                    required: false,
                    accessor: "SortDirection",
                    label: "Sort Direction",
                    options: [
                      { value: "ASC", label: "ASC" },
                      { value: "DESC", label: "DESC" },
                    ],
                  },
                ]}
                persistSearchFilters={{ page: 1, size: 10 }}
                toLocation="/vehicles"
                queryFilterKey="filters"
              />
            </div>

            <div className="shadow">
              <ModuleTable
                key={`table-cols-${columnDefs.length}`}
                data={vehiclesData.data.data}
                columns={columnDefs}
                noRows={
                  vehiclesData.isLoading === false &&
                  vehiclesData.data.data.length === 0
                }
                onColumnOrderChange={handleSaveColumnsOrder}
                lockedColumns={["VehicleNo"]}
                rawColumnsData={columnsData.data}
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
                >
                  less
                </Link>
                &nbsp;|&nbsp;
                <Link
                  to="/vehicles"
                  search={(search) => ({
                    ...search,
                    page:
                      pageNumber === vehiclesData.data.totalPages
                        ? pageNumber
                        : pageNumber + 1,
                    size,
                  })}
                >
                  plus
                </Link>
              </p>
              <p>
                {JSON.stringify({
                  totalPages: vehiclesData.data.totalPages,
                  totalRecords: vehiclesData.data.totalRecords,
                })}
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default VehiclesSearchPage;
