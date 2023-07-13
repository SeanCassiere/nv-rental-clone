import { useCallback, useMemo } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/router";
import {
  createColumnHelper,
  type PaginationState,
  type ColumnOrderState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import Protector from "../../components/Protector";
import {
  ModuleTable,
  ModuleTableColumnHeader,
  ModuleTableCellWrap,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import { PlusIconFilled } from "../../components/icons";
import { LinkButton } from "../../components/Form";

import { searchReservationsRoute } from "../../routes/reservations/searchReservations";
import { viewReservationByIdRoute } from "../../routes/reservations/reservationIdPath";
import { addReservationRoute } from "../../routes/reservations/addReservation";

import { useGetReservationsList } from "../../hooks/network/reservation/useGetReservationsList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { useGetReservationStatusList } from "../../hooks/network/reservation/useGetReservationStatusList";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";
import { useGetReservationTypesList } from "../../hooks/network/reservation/useGetReservationTypes";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { type TReservationListItemParsed } from "../../utils/schemas/reservation";
import { normalizeReservationListSearchParams } from "../../utils/normalize-search-params";
import { ReservationFiltersSchema } from "../../utils/schemas/reservation";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { titleMaker } from "../../utils/title-maker";
import { ReservationDateTimeColumns } from "../../utils/columns";
import { cn } from "@/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<TReservationListItemParsed>();

function ReservationsSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate({ from: searchReservationsRoute.id });

  const search = useSearch({ from: searchReservationsRoute.id });
  const { pageNumber, size, searchFilters } =
    normalizeReservationListSearchParams(search);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
      pageSize: size,
    }),
    [pageNumber, size]
  );

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
            if (column.columnHeader === "ReservationNumber") {
              const reservationId = item.table.getRow(item.row.id).original.id;
              return (
                <ModuleTableCellWrap>
                  <Link
                    to={viewReservationByIdRoute.to}
                    params={{ reservationId: String(reservationId) }}
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
            if (column.columnHeader === "ReservationStatusName") {
              return (
                <ModuleTableCellWrap>
                  <Badge variant="outline">{value}</Badge>
                </ModuleTableCellWrap>
              );
            }

            if (ReservationDateTimeColumns.includes(column.columnHeader)) {
              return (
                <ModuleTableCellWrap>
                  {t("intlDateTime", { value: new Date(value) })}
                </ModuleTableCellWrap>
              );
            }

            return <ModuleTableCellWrap>{value}</ModuleTableCellWrap>;
          },
          enableHiding: column.columnHeader !== "ReservationNumber",
          enableSorting: false,
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "reservations" });

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

  useDocumentTitle(titleMaker("Reservations"));

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 pt-1.5 sm:px-4">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                  Reservations
                </h1>
                <div>
                  <LinkButton
                    color="teal"
                    to={addReservationRoute.to}
                    search={() => ({ stage: "rental-information" })}
                    className="flex items-center justify-center gap-2"
                  >
                    <PlusIconFilled className="h-4 w-4" />
                    New Reservation
                  </LinkButton>
                </div>
              </div>
            }
            subtitleText="Search through your rental reservations and view details."
            includeBottomBorder
          />
        </div>
        <div className="mx-auto max-w-full px-2 sm:px-4">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={ReservationFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  to: searchReservationsRoute.to,
                  params: {},
                  search: () => ({
                    page: 1,
                    size: 10,
                    filters: { ...formValues },
                  }),
                });
              }}
              onReset={async () => {
                navigate({
                  to: searchReservationsRoute.to,
                  params: {},
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
                  accessor: "CheckinLocationId",
                  label: "Checkin location",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...locationsList.data.data.map((item) => ({
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
              data={reservationsData.data?.data || []}
              columns={columnDefs}
              onColumnOrderChange={handleSaveColumnsOrder}
              rawColumnsData={columnsData?.data || []}
              onColumnVisibilityChange={handleSaveColumnVisibility}
              totalPages={
                reservationsData.data?.totalRecords
                  ? Math.ceil(reservationsData.data?.totalRecords / size) ?? -1
                  : 0
              }
              pagination={pagination}
              onPaginationChange={(newPaginationState) => {
                navigate({
                  to: searchReservationsRoute.to,
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
      </div>
    </Protector>
  );
}

export default ReservationsSearchPage;
