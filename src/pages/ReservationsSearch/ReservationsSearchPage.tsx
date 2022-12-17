import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetReservationsList } from "../../hooks/network/reservation/useGetReservationsList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { reservationFiltersModel } from "../../utils/schemas/reservation";
import type { ReservationListItemType } from "../../types/Reservation";
import { sortColumnOrder } from "../../utils/ordering";

const columnHelper = createColumnHelper<ReservationListItemType>();

function ReservationsSearchPage() {
  const { page: pageNumber = 1, size = 10, filters } = useSearch();
  const searchFilters = {
    Statuses: filters?.Statuses || undefined,
    CreatedDateFrom: filters?.CreatedDateFrom || undefined,
    CreatedDateTo: filters?.CreatedDateTo || undefined,
    SortDirection: filters?.SortDirection || "ASC",
  };

  const reservationsData = useGetReservationsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const columnsData = useGetModuleColumns({ module: "reservations" });

  const columnDefs = columnsData.data.sort(sortColumnOrder).map((column) =>
    columnHelper.accessor(column.columnHeader as any, {
      id: column.columnHeader,
      header: () => column.columnHeaderDescription,
      cell: (item) => {
        if (column.columnHeader === "ReservationNumber") {
          const reservationId = item.table.getRow(item.row.id).original.id;
          return (
            <Link
              to="/agreements/$agreementId"
              params={{ agreementId: String(reservationId) }}
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

  const saveColumnsMutation = useSaveModuleColumns({ module: "reservations" });

  const saveColumnsOrder = (newColumnOrder: string[]) => {
    saveColumnsMutation.mutate({
      allColumns: columnsData.data,
      accessorKeys: newColumnOrder,
    });
  };

  const saveColumnVisibility = (graph: ColumnVisibilityGraph) => {
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Reservations
            </h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div className="my-2 py-4">
              <ModuleSearchFilters
                key={`module-filters-${JSON.stringify(searchFilters).length}`}
                validationSchema={reservationFiltersModel}
                initialValues={searchFilters}
                searchFiltersBlueprint={[
                  {
                    name: "Statuses",
                    type: "number",
                    required: false,
                    accessor: "Statuses",
                    label: "Status",
                  },
                  {
                    name: "CreatedDateFrom",
                    type: "date",
                    required: false,
                    accessor: "CreatedDateFrom",
                    label: "Start date",
                  },
                  {
                    name: "CreatedDateTo",
                    type: "date",
                    required: false,
                    accessor: "CreatedDateTo",
                    label: "End date",
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
                toLocation="/reservations"
                queryFilterKey="filters"
              />
            </div>

            <div className="shadow">
              <ModuleTable
                key={`table-cols-${columnDefs.length}`}
                data={reservationsData.data.data}
                columns={columnDefs}
                noRows={
                  reservationsData.isLoading === false &&
                  reservationsData.data.data.length === 0
                }
                onColumnOrderChange={saveColumnsOrder}
                lockedColumns={["ReservationNumber"]}
                rawColumnsData={columnsData.data}
                showColumnPicker
                onColumnVisibilityChange={saveColumnVisibility}
              />
            </div>
            <div>
              <p>
                <Link
                  to="/reservations"
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
                  to="/reservations"
                  search={(search) => ({
                    ...search,
                    page:
                      pageNumber === reservationsData.data.totalPages
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
                  totalPages: reservationsData.data.totalPages,
                  totalRecords: reservationsData.data.totalRecords,
                })}
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default ReservationsSearchPage;
