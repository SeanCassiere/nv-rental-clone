import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { vehicleFiltersModel } from "../../utils/schemas/vehicle";
import type { VehicleListItemType } from "../../types/Vehicle";

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

  const visibleOrderedColumns = columnsData.data
    .filter((col) => col.isSelected)
    .sort((col1, col2) => col1.orderIndex - col2.orderIndex);

  const columnDefs = visibleOrderedColumns.map((column) =>
    columnHelper.accessor(column.columnHeader as any, {
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

  const saveColumnsOrder = (newColumnOrder: string[]) => {
    saveColumnsMutation.mutate({
      allColumns: columnsData.data,
      accessorKeys: newColumnOrder,
    });
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

            <div>
              <ModuleTable<VehicleListItemType>
                key={`table-cols-${columnDefs.length}`}
                data={vehiclesData.data.data}
                columns={columnDefs}
                noRows={
                  vehiclesData.isLoading === false &&
                  vehiclesData.data.data.length === 0
                }
                onColumnOrdering={saveColumnsOrder}
                lockedColumns={["VehicleNo"]}
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
