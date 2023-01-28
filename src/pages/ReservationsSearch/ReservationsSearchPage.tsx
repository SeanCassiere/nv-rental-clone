import { useCallback, useEffect, useMemo } from "react";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { searchReservationsRoute } from "../../routes/reservations/searchReservations";
import Protector from "../../components/Protector";
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
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";
import { useGetReservationTypesList } from "../../hooks/network/reservation/useGetReservationTypes";
import { viewReservationRoute } from "../../routes/reservations/viewReservation";
import { titleMaker } from "../../utils/title-maker";

const columnHelper = createColumnHelper<TReservationListItemParsed>();

export const ReservationDateTimeColumns = [
  "CreatedDate",
  "StartDate",
  "EndDate",
];

function ReservationsSearchPage() {
  const { t } = useTranslation();

  const router = useRouter();

  const search = useSearch({ from: searchReservationsRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeReservationListSearchParams(search);

  const reservationsData = useGetReservationsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const reservationStatusList = useGetReservationStatusList();
  const vehicleTypesList = useGetVehicleTypesList();
  const locationsList = useGetLocationsList({ locationIsActive: true });
  const reservationTypesList = useGetReservationTypesList();

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
                  to={viewReservationRoute.id}
                  params={{ reservationId: String(reservationId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-medium text-slate-800"
                  preload="intent"
                >
                  {value}
                </Link>
              );
            }

            if (ReservationDateTimeColumns.includes(column.columnHeader)) {
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

  useEffect(() => {
    document.title = titleMaker("Reservations");
  }, []);

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h2 className="select-none text-2xl font-semibold leading-tight tracking-tight text-gray-700">
            Reservations
          </h2>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={ReservationFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                router.navigate({
                  to: "/reservations",
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
                  to: "/reservations",
                  search: () => ({ page: 1, size: 10, filters: undefined }),
                });
              }}
              searchFiltersBlueprint={[
                {
                  queryKey: "Statuses",
                  type: "multiple-dropdown",
                  required: false,
                  accessor: "Statuses",
                  label: "Status",
                  options: [
                    {
                      value: undefined,
                      label: "All",
                      isPlaceholder: true,
                      isSelectAll: true,
                    },
                    ...reservationStatusList.data.map((item) => ({
                      value: `${item.id}`,
                      label: item.name,
                    })),
                  ],
                },
                {
                  queryKey: "ReservationTypes",
                  type: "single-dropdown",
                  required: false,
                  accessor: "ReservationTypes",
                  label: "Type",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...reservationTypesList.data.map((item) => ({
                      value: `${item.typeName}`,
                      label: item.typeName,
                    })),
                  ],
                },
                {
                  queryKey: "CreatedDateFrom",
                  type: "date",
                  required: false,
                  accessor: "CreatedDateFrom",
                  label: "Start date",
                },
                {
                  queryKey: "CreatedDateTo",
                  type: "date",
                  required: false,
                  accessor: "CreatedDateTo",
                  label: "End date",
                },
                {
                  queryKey: "PickupLocationId",
                  type: "single-dropdown",
                  required: false,
                  accessor: "CheckoutLocationId",
                  label: "Checkout location",
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
                  accessor: "CheckinLocationId",
                  label: "Checkin location",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...locationsList.data.map((item) => ({
                      value: `${item.locationId}`,
                      label: `${item.locationName}`,
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
                  queryKey: "CustomerId",
                  type: "hidden",
                  required: false,
                  accessor: "CustomerId",
                  label: "CustomerId",
                },
                {
                  queryKey: "VehicleNo",
                  type: "text",
                  required: false,
                  accessor: "VehicleNo",
                  label: "Vehicle no.",
                },
                {
                  queryKey: "VehicleId",
                  type: "hidden",
                  required: false,
                  accessor: "VehicleId",
                  label: "VehicleId",
                },
                {
                  queryKey: "SortDirection",
                  type: "single-dropdown",
                  required: false,
                  accessor: "SortDirection",
                  label: "Sort direction",
                  options: [
                    { value: "ASC", label: "ASC" },
                    { value: "DESC", label: "DESC" },
                  ],
                },
              ]}
            />
          </div>

          <div>
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
