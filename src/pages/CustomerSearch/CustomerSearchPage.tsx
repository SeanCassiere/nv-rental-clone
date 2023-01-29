import { useCallback, useEffect, useMemo } from "react";
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
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import CommonEmptyStateContent from "../../components/Layout/CommonEmptyStateContent";
import { UsersSolid } from "../../components/icons";

import { searchCustomersRoute } from "../../routes/customers/searchCustomers";
import { viewCustomerRoute } from "../../routes/customers/viewCustomer";

import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { useGetCustomerTypesList } from "../../hooks/network/customer/useGetCustomerTypes";

import { CustomerFiltersSchema } from "../../utils/schemas/customer";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import type { TCustomerListItemParsed } from "../../utils/schemas/customer";
import { normalizeCustomerListSearchParams } from "../../utils/normalize-search-params";
import { titleMaker } from "../../utils/title-maker";

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
          header: () => column.columnHeaderDescription,
          cell: (item) => {
            const value = item.getValue();
            if (
              column.columnHeader === "FirstName" &&
              column.isSelected === true
            ) {
              const customerId = item.table.getRow(item.row.id).original
                .CustomerId;
              return (
                <Link
                  to={viewCustomerRoute.id}
                  params={{ customerId: String(customerId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-medium text-slate-800"
                  preload="intent"
                >
                  {value}
                </Link>
              );
            }

            if (DateColumns.includes(column.columnHeader)) {
              return t("intlDate", { value: new Date(value) });
            }

            return value;
          },
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "customers" });

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
    document.title = titleMaker("Customers");
  }, []);

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 pt-1.5 sm:px-6 md:px-8">
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
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={CustomerFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                navigate({
                  to: "/customers",
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
                  to: "/customers",
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

          {customersData.data.isRequestMade === false ? null : customersData
              .data.data.length === 0 ? (
            <CommonEmptyStateContent
              title="No customers"
              subtitle="You don't have any customers to show here."
              icon={<UsersSolid className="mx-auto h-12 w-12 text-slate-400" />}
            />
          ) : (
            <div>
              <ModuleTable
                data={customersData.data?.data || []}
                columns={columnDefs}
                noRows={
                  customersData.isLoading === false &&
                  customersData.data?.data.length === 0
                }
                onColumnOrderChange={handleSaveColumnsOrder}
                lockedColumns={["FirstName"]}
                rawColumnsData={columnsData?.data || []}
                showColumnPicker
                onColumnVisibilityChange={handleSaveColumnVisibility}
                pagination={pagination}
                totalPages={
                  Math.ceil(customersData.data.totalRecords / size) ?? -1
                }
                onPaginationChange={(newPaginationState) => {
                  navigate({
                    to: "/customers",
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

export default CustomerSearchPage;
