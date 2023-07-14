import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/router";
import {
  createColumnHelper,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import Protector from "../../components/Protector";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import { PlusIconFilled } from "../../components/icons";
import { LinkButton } from "../../components/Form";

import { searchAgreementsRoute } from "@/routes/agreements/searchAgreements";
import { viewAgreementByIdRoute } from "@/routes/agreements/agreementIdPath";
import { addAgreementRoute } from "@/routes/agreements/addAgreement";

import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";
import { useGetAgreementStatusList } from "@/hooks/network/agreement/useGetAgreementStatusList";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetAgreementTypesList } from "@/hooks/network/agreement/useGetAgreementTypes";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import {
  PrimaryModuleTable,
  PrimaryModuleTableColumnHeader,
  PrimaryModuleTableCellWrap,
} from "@/components/primary-module/table";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { AgreementFiltersSchema } from "@/utils/schemas/agreement";
import { sortColOrderByOrderIndex } from "@/utils/ordering";
import { type TAgreementListItemParsed } from "@/utils/schemas/agreement";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import { titleMaker } from "@/utils/title-maker";
import { AgreementDateTimeColumns } from "@/utils/columns";
import { cn } from "@/utils";

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

function AgreementsSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate({ from: searchAgreementsRoute.id });

  const search = useSearch({ from: searchAgreementsRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeAgreementListSearchParams(search);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    Object.entries(searchFilters).reduce(
      (prev, [key, value]) => [...prev, { id: key, value }],
      [] as ColumnFiltersState
    )
  );

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
          meta: {
            columnName: column.columnHeaderDescription ?? undefined,
          },
          header: ({ column: columnChild }) => (
            <PrimaryModuleTableColumnHeader
              column={columnChild}
              title={column.columnHeaderDescription ?? ""}
            />
          ),
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "AgreementNumber") {
              const agreementId = item.table.getRow(item.row.id).original
                .AgreementId;
              return (
                <PrimaryModuleTableCellWrap>
                  <Link
                    to={viewAgreementByIdRoute.to}
                    params={{ agreementId: String(agreementId) }}
                    search={() => ({ tab: "summary" })}
                    className={cn(
                      buttonVariants({ variant: "link", size: "sm" }),
                      "p-0"
                    )}
                    preload="intent"
                  >
                    {value}
                  </Link>
                </PrimaryModuleTableCellWrap>
              );
            }
            if (column.columnHeader === "AgreementStatusName") {
              return (
                <PrimaryModuleTableCellWrap>
                  <Badge variant="outline">{String(value)}</Badge>
                </PrimaryModuleTableCellWrap>
              );
            }
            if (AgreementDateTimeColumns.includes(column.columnHeader)) {
              return (
                <PrimaryModuleTableCellWrap>
                  {t("intlDateTime", { value: new Date(value) })}
                </PrimaryModuleTableCellWrap>
              );
            }
            return (
              <PrimaryModuleTableCellWrap>{value}</PrimaryModuleTableCellWrap>
            );
          },
          enableSorting: false,
          enableHiding: column.columnHeader !== "AgreementNumber",
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "agreements" });

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

  useDocumentTitle(titleMaker("Agreements"));

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 pt-1.5 sm:px-4">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                  Agreements
                </h1>
                {/* <div>
                  <LinkButton
                    color="teal"
                    to={addAgreementRoute.to}
                    search={() => ({ stage: "rental-information" })}
                    className="flex items-center justify-center gap-2"
                  >
                    <PlusIconFilled className="h-4 w-4" />
                    New Agreement
                  </LinkButton>
                </div> */}
              </div>
            }
            subtitleText="Search through your rental agreements and view details."
            includeBottomBorder
          />
        </div>
        <div className="mx-auto my-4 max-w-full px-2 sm:mb-2 sm:mt-6 sm:px-4">
          {/* <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={AgreementFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  to: searchAgreementsRoute.to,
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
                  to: searchAgreementsRoute.to,
                  params: {},
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
          </div> */}

          <PrimaryModuleTable
            data={agreementsData.data?.data || []}
            columns={columnDefs}
            onColumnOrderChange={handleSaveColumnsOrder}
            rawColumnsData={columnsData?.data || []}
            onColumnVisibilityChange={handleSaveColumnVisibility}
            totalPages={
              agreementsData.data?.totalRecords
                ? Math.ceil(agreementsData.data?.totalRecords / size) ?? -1
                : 0
            }
            pagination={pagination}
            onPaginationChange={(newPaginationState) => {
              navigate({
                to: searchAgreementsRoute.to,
                params: {},
                search: (current) => ({
                  ...current,
                  page: newPaginationState.pageIndex + 1,
                  size: newPaginationState.pageSize,
                  filters: searchFilters,
                }),
              });
            }}
            filters={{
              columnFilters,
              setColumnFilters,
              onClearFilters: () => {
                navigate({
                  to: searchAgreementsRoute.to,
                  params: {},
                  search: () => ({
                    page: 1,
                    size: pagination.pageSize,
                    filters: {},
                  }),
                });
              },
              onSearchWithFilters: () => {
                const filters = columnFilters.reduce(
                  (prev, current) => ({
                    ...prev,
                    [current.id]: current.value,
                  }),
                  {}
                );
                navigate({
                  to: searchAgreementsRoute.to,
                  params: {},
                  search: () => ({
                    page: pagination.pageIndex + 1,
                    size: pagination.pageSize,
                    filters,
                  }),
                });
              },
              filterableColumns: [
                {
                  id: "Statuses",
                  title: "Status",
                  type: "multi-select",
                  options: agreementStatusList.data.map((item) => ({
                    value: `${item.id}`,
                    label: item.name,
                  })),
                  defaultValue: [],
                },
                {
                  id: "AgreementTypes",
                  title: "Type",
                  type: "multi-select",
                  options: agreementTypesList.data.map((item) => ({
                    value: `${item.typeName}`,
                    label: item.typeName,
                  })),
                  defaultValue: [],
                },
                {
                  id: "PickupLocationId",
                  title: "Checkout location",
                  type: "select",
                  options: locationsList.data.data.map((item) => ({
                    value: `${item.locationId}`,
                    label: `${item.locationName}`,
                  })),
                },
                {
                  id: "ReturnLocationId",
                  title: "Checkin location",
                  type: "select",
                  options: locationsList.data.data.map((item) => ({
                    value: `${item.locationId}`,
                    label: `${item.locationName}`,
                  })),
                },
                {
                  id: "VehicleTypeId",
                  title: "Vehicle type",
                  type: "select",
                  options: vehicleTypesList.data.map((item) => ({
                    value: `${item.VehicleTypeId}`,
                    label: item.VehicleTypeName,
                  })),
                },
                {
                  id: "IsSearchOverdues",
                  title: "Search overdues?",
                  type: "select",
                  options: [
                    { value: "true", label: "true" },
                    { value: "false", label: "false" },
                  ],
                  defaultValue: "false",
                },
              ],
            }}
          />
        </div>
      </div>
    </Protector>
  );
}

export default AgreementsSearchPage;
