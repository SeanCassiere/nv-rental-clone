import { useCallback, useMemo } from "react";
import { Link, useSearch } from "@tanstack/react-router";
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

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

const DateColumns = ["DateOfbirth", "LicenseExpiryDate"];

function CustomerSearchPage() {
  const { t } = useTranslation();

  const search = useSearch({ from: searchCustomersRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeCustomerListSearchParams(search);

  const customersData = useGetCustomersList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

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
                  to="/customers/$customerId"
                  params={{ customerId: String(customerId) }}
                  className="font-medium text-teal-700"
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

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={CustomerFiltersSchema}
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
              toLocation="/customers"
              queryFilterKey="filters"
            />
          </div>

          <div className="shadow">
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
