import { useCallback, useMemo } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import Protector from "../../components/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import CommonEmptyStateContent from "../../components/Layout/CommonEmptyStateContent";
import { DocumentTextSolid } from "../../components/icons";

import { searchAgreementsRoute } from "../../routes/agreements/searchAgreements";
import { viewAgreementRoute } from "../../routes/agreements/viewAgreement";

import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useGetAgreementStatusList } from "../../hooks/network/agreement/useGetAgreementStatusList";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";
import { useGetAgreementTypesList } from "../../hooks/network/agreement/useGetAgreementTypes";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { AgreementFiltersSchema } from "../../utils/schemas/agreement";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { type TAgreementListItemParsed } from "../../utils/schemas/agreement";
import { normalizeAgreementListSearchParams } from "../../utils/normalize-search-params";
import { titleMaker } from "../../utils/title-maker";

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

export const AgreementDateTimeColumns = [
  "CreatedDate",
  "CheckoutDate",
  "CheckinDate",
];

function AgreementsSearchPage() {
  const { t } = useTranslation();

  // const navigate = useNavigate({ from: searchAgreementsRoute.id });
  const navigate = useNavigate();

  const search = useSearch({ from: searchAgreementsRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeAgreementListSearchParams(search);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
      pageSize: size,
    }),
    [pageNumber, size]
  );

  const agreementsData = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const agreementStatusList = useGetAgreementStatusList();
  const vehicleTypesList = useGetVehicleTypesList();
  const locationsList = useGetLocationsList({ locationIsActive: true });
  const agreementTypesList = useGetAgreementTypesList();

  const columnsData = useGetModuleColumns({ module: "agreements" });

  const columnDefs = useMemo(
    () =>
      columnsData.data.sort(sortColOrderByOrderIndex).map((column) =>
        columnHelper.accessor(column.columnHeader as any, {
          id: column.columnHeader,
          header: () => column.columnHeaderDescription,
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "AgreementNumber") {
              const agreementId = item.table.getRow(item.row.id).original
                .AgreementId;
              return (
                <Link
                  to={viewAgreementRoute.id}
                  params={{ agreementId: String(agreementId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-semibold text-slate-800"
                  preload="intent"
                >
                  {value}
                </Link>
              );
            }

            if (AgreementDateTimeColumns.includes(column.columnHeader)) {
              return t("intlDateTime", { value: new Date(value) });
            }

            return value;
          },
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "agreements" });

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

  useDocumentTitle(titleMaker("Agreements"));

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 pt-1.5 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Agreements
              </h1>
            }
            subtitleText="Search through your rental agreements and view details."
            includeBottomBorder
          />
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={AgreementFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  search: () => ({
                    page: 1,
                    size: 10,
                    filters: { ...formValues },
                  }),
                });
              }}
              onReset={async () => {
                navigate({
                  search: () => ({
                    page: 1,
                    size: 10,
                    filters: undefined,
                  }),
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
                    ...agreementStatusList.data.map((item) => ({
                      value: `${item.id}`,
                      label: item.name,
                      isPlaceholder: false,
                      isSelectAll: false,
                    })),
                  ],
                },
                {
                  queryKey: "AgreementTypes",
                  type: "single-dropdown",
                  required: false,
                  accessor: "AgreementTypes",
                  label: "Type",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...agreementTypesList.data.map((item) => ({
                      value: `${item.typeName}`,
                      label: item.typeName,
                    })),
                  ],
                },
                {
                  queryKey: "StartDate",
                  type: "date",
                  required: false,
                  accessor: "StartDate",
                  label: "Start date",
                },
                {
                  queryKey: "EndDate",
                  type: "date",
                  required: false,
                  accessor: "EndDate",
                  label: "End date",
                },
                {
                  queryKey: "CustomerId",
                  type: "hidden",
                  required: false,
                  accessor: "CustomerId",
                  label: "CustomerId",
                },
                {
                  queryKey: "PickupLocationId",
                  type: "single-dropdown",
                  required: false,
                  accessor: "PickupLocationId",
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
                  accessor: "ReturnLocationId",
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
                  queryKey: "IsSearchOverdues",
                  type: "single-dropdown",
                  required: false,
                  accessor: "IsSearchOverdues",
                  label: "Search overdues?",
                  options: [
                    { value: "true", label: "true", isPlaceholder: true },
                    { value: "false", label: "false" },
                  ],
                },
                {
                  queryKey: "SortBy",
                  type: "single-dropdown",
                  required: false,
                  accessor: "SortBy",
                  label: "Sort by",
                  options: [
                    {
                      value: "CreatedDate",
                      label: "Created date",
                      isPlaceholder: true,
                    },
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

          {agreementsData.data?.isRequestMade === false ? null : agreementsData
              .data?.data.length === 0 ? (
            <CommonEmptyStateContent
              title="No agreements"
              subtitle="You don't have any rental agreements to show here."
              icon={
                <DocumentTextSolid className="mx-auto h-12 w-12 text-slate-400" />
              }
            />
          ) : (
            <div>
              <ModuleTable
                data={agreementsData.data?.data || []}
                columns={columnDefs}
                noRows={
                  agreementsData.isLoading === false &&
                  agreementsData.data?.data.length === 0
                }
                onColumnOrderChange={handleSaveColumnsOrder}
                lockedColumns={["AgreementNumber"]}
                rawColumnsData={columnsData?.data || []}
                showColumnPicker
                onColumnVisibilityChange={handleSaveColumnVisibility}
                pagination={pagination}
                totalPages={
                  agreementsData.data?.totalRecords
                    ? Math.ceil(agreementsData.data?.totalRecords / size) ?? -1
                    : 0
                }
                onPaginationChange={(newPaginationState) => {
                  navigate({
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

export default AgreementsSearchPage;
