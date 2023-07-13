import { useCallback, useMemo } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/router";
import {
  createColumnHelper,
  type PaginationState,
  type VisibilityState,
  type ColumnOrderState,
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

import { searchCustomersRoute } from "../../routes/customers/searchCustomers";
import { viewCustomerByIdRoute } from "../../routes/customers/customerIdPath";

import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { useGetCustomerTypesList } from "../../hooks/network/customer/useGetCustomerTypes";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { CustomerFiltersSchema } from "../../utils/schemas/customer";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import type { TCustomerListItemParsed } from "../../utils/schemas/customer";
import { normalizeCustomerListSearchParams } from "../../utils/normalize-search-params";
import { titleMaker } from "../../utils/title-maker";
import { cn } from "@/utils";
import { buttonVariants } from "@/components/ui/button";

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

const DateColumns = ["DateOfbirth", "LicenseExpiryDate"];

function CustomerSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate({ from: searchCustomersRoute.id });

  const search = useSearch({ from: searchCustomersRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeCustomerListSearchParams(search);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
      pageSize: size,
    }),
    [pageNumber, size]
  );

  const customersData = useGetCustomersList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });
  const customerTypesList = useGetCustomerTypesList();

  const columnsData = useGetModuleColumns({ module: "customers" });

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
            if (
              column.columnHeader === "FirstName" &&
              column.isSelected === true
            ) {
              const customerId = item.table.getRow(item.row.id).original
                .CustomerId;
              return (
                <ModuleTableCellWrap>
                  <Link
                    to={viewCustomerByIdRoute.to}
                    params={{ customerId: String(customerId) }}
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

            if (DateColumns.includes(column.columnHeader)) {
              return (
                <div className="min-w-[80px] px-2">
                  {t("intlDate", { value: new Date(value) })}
                </div>
              );
            }

            return <ModuleTableCellWrap>{value}</ModuleTableCellWrap>;
          },
          enableHiding: column.columnHeader !== "FirstName",
          enableSorting: false,
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "customers" });

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

  useDocumentTitle(titleMaker("Customers"));

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 py-4 sm:px-4">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Customers
              </h1>
            }
            subtitleText="Search through your registered customers and view details."
            includeBottomBorder
          />
        </div>
        <div className="mx-auto max-w-full px-2 sm:px-4">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={CustomerFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  to: searchCustomersRoute.to,
                  params: {},
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
                  to: searchCustomersRoute.to,
                  params: {},
                  search: () => ({ page: 1, size: 10, filters: undefined }),
                });
              }}
              searchFiltersBlueprint={[
                {
                  queryKey: "CustomerTypes",
                  type: "single-dropdown",
                  required: false,
                  accessor: "CustomerTypes",
                  label: "Type",
                  options: [
                    { value: undefined, label: "All", isPlaceholder: true },
                    ...customerTypesList.data.map((item) => ({
                      value: `${item.typeName}`,
                      label: item.typeName,
                    })),
                  ],
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
                    { value: "ASC", label: "ASC", isPlaceholder: true },
                    { value: "DESC", label: "DESC" },
                  ],
                },
              ]}
            />
          </div>

          <div>
            <ModuleTable
              data={customersData.data?.data || []}
              columns={columnDefs}
              onColumnOrderChange={handleSaveColumnsOrder}
              rawColumnsData={columnsData?.data || []}
              onColumnVisibilityChange={handleSaveColumnVisibility}
              totalPages={
                customersData.data?.totalRecords
                  ? Math.ceil(customersData.data?.totalRecords / size) ?? -1
                  : 0
              }
              pagination={pagination}
              onPaginationChange={(newPaginationState) => {
                navigate({
                  to: searchCustomersRoute.to,
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

export default CustomerSearchPage;
