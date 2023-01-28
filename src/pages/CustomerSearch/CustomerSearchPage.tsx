import { useCallback, useEffect, useMemo } from "react";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { searchCustomersRoute } from "../../routes/customers/searchCustomers";
import Protector from "../../components/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import ScrollToTop from "../../components/ScrollToTop";

import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { CustomerFiltersSchema } from "../../utils/schemas/customer";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import type { TCustomerListItemParsed } from "../../utils/schemas/customer";
import { normalizeCustomerListSearchParams } from "../../utils/normalize-search-params";
import { useGetCustomerTypesList } from "../../hooks/network/customer/useGetCustomerTypes";
import { viewCustomerRoute } from "../../routes/customers/viewCustomer";
import { titleMaker } from "../../utils/title-maker";

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

const DateColumns = ["DateOfbirth", "LicenseExpiryDate"];

function CustomerSearchPage() {
  const { t } = useTranslation();

  const router = useRouter();
  const search = useSearch({ from: searchCustomersRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeCustomerListSearchParams(search);

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
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h2 className="select-none text-2xl font-semibold leading-tight tracking-tight text-gray-700">
            Customers
          </h2>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={CustomerFiltersSchema}
              initialValues={searchFilters}
              onSubmit={async (formValues) => {
                router.navigate({
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
                router.navigate({
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

          <div>
            <ModuleTable
              key={`table-cols-${columnDefs.length}`}
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
            />
          </div>
          <div>
            <p>
              <Link
                to="/customers"
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
                to="/customers"
                search={(search) => ({
                  ...search,
                  page:
                    pageNumber === customersData.data?.totalPages
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
                totalPages: customersData.data?.totalPages,
                totalRecords: customersData.data?.totalRecords,
              })}
            </p>
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default CustomerSearchPage;
