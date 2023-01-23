import { useCallback, useMemo } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { reservationsSearchRoute } from "../../routes";
import Protector from "../../routes/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";

import { useGetReservationsList } from "../../hooks/network/reservation/useGetReservationsList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { ReservationFiltersSchema } from "../../utils/schemas/reservation";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { useGetReservationStatusList } from "../../hooks/network/reservation/useGetReservationStatusList";
import { type TReservationListItemParsed } from "../../utils/schemas/reservation";
import { normalizeReservationListSearchParams } from "../../utils/normalize-search-params";

const columnHelper = createColumnHelper<TReservationListItemParsed>();

const DateTimeColumns = ["CreatedDate", "StartDate", "EndDate"];

function ReservationsSearchPage() {
  const { t } = useTranslation();

  const search = useSearch({ from: reservationsSearchRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeReservationListSearchParams(search);

  const reservationsData = useGetReservationsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const reservationStatusList = useGetReservationStatusList();

  const columnsData = useGetModuleColumns({ module: "reservations" });

  const columnDefs = useMemo(
    () =>
      columnsData.data.sort(sortColOrderByOrderIndex).map((column) =>
        columnHelper.accessor(column.columnHeader as any, {
          id: column.columnHeader,
          header: () => column.columnHeaderDescription,
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "ReservationNumber") {
              const reservationId = item.table.getRow(item.row.id).original.id;
              return (
                <Link
                  to="/reservations/$reservationId"
                  params={{ reservationId: String(reservationId) }}
                  className="font-medium text-teal-700"
                  preload="intent"
                >
                  {value}
                </Link>
              );
            }

            if (DateTimeColumns.includes(column.columnHeader)) {
              return t("intlDateTime", { value: new Date(value) });
            }

            return value;
          },
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "reservations" });

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

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reservations</h1>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={ReservationFiltersSchema}
              initialValues={searchFilters}
              searchFiltersBlueprint={[
                {
                  name: "Statuses",
                  type: "multiple-dropdown",
                  required: false,
                  accessor: "Statuses",
                  label: "Status",
                  options: [
                    { value: "undefined", label: "Select" },
                    ...reservationStatusList.data.map((item) => ({
                      value: `${item.id}`,
                      label: item.name,
                    })),
                  ],
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
                  name: "CustomerId",
                  type: "hidden",
                  required: false,
                  accessor: "CustomerId",
                  label: "CustomerId",
                },
                {
                  name: "VehicleNo",
                  type: "text",
                  required: false,
                  accessor: "VehicleNo",
                  label: "VehicleNo",
                },
                {
                  name: "VehicleId",
                  type: "hidden",
                  required: false,
                  accessor: "VehicleId",
                  label: "VehicleId",
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
              data={reservationsData.data?.data || []}
              columns={columnDefs}
              noRows={
                reservationsData.isLoading === false &&
                reservationsData.data?.data.length === 0
              }
              onColumnOrderChange={handleSaveColumnsOrder}
              lockedColumns={["ReservationNumber"]}
              rawColumnsData={columnsData?.data || []}
              showColumnPicker
              onColumnVisibilityChange={handleSaveColumnVisibility}
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
                preload="intent"
              >
                less
              </Link>
              &nbsp;|&nbsp;
              <Link
                to="/reservations"
                search={(search) => ({
                  ...search,
                  page:
                    pageNumber === reservationsData.data?.totalPages
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
                totalPages: reservationsData.data?.totalPages,
                totalRecords: reservationsData.data?.totalRecords,
              })}
            </p>
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default ReservationsSearchPage;
