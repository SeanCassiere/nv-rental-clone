import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { customerFiltersModel } from "../../utils/schemas/customer";
import type { CustomerListItemType } from "../../types/Customer";

const columnHelper = createColumnHelper<CustomerListItemType>();

function CustomerSearchPage() {
  const { page: pageNumber = 1, size = 10, filters } = useSearch();
  const searchFilters = {
    Active: typeof filters?.Active !== "undefined" ? filters?.Active : true,
    SortDirection: filters?.SortDirection || "ASC",
  };

  const customersData = useGetCustomersList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const columnsData = useGetModuleColumns({ module: "customers" });

  const visibleOrderedColumns = columnsData.data
    .filter((col) => col.isSelected)
    .sort((col1, col2) => col1.orderIndex - col2.orderIndex);

  const columnDefs = visibleOrderedColumns.map((column) =>
    columnHelper.accessor(column.searchText as any, {
      header: () => column.columnHeaderDescription,
      cell: (item) => {
        if (column.columnHeader === "FirstName" && column.isSelected === true) {
          const customerId = item.table.getRow(item.row.id).original.CustomerId;
          return (
            <Link
              to="/agreements/$agreementId"
              params={{ agreementId: String(customerId) }}
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

  const saveColumnsMutation = useSaveModuleColumns({ module: "customers" });

  const saveColumnsOrder = (newColumnOrder: string[]) => {
    saveColumnsMutation.mutate({
      allColumns: columnsData.data,
      accessorKeys: newColumnOrder,
    });
  };

  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div className="my-2 py-4">
              <ModuleSearchFilters
                key={`module-filters-${JSON.stringify(searchFilters).length}`}
                validationSchema={customerFiltersModel}
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

            <div>
              <ModuleTable
                key={`table-cols-${columnDefs.length}`}
                data={customersData.data.data}
                columns={columnDefs}
                noRows={
                  customersData.isLoading === false &&
                  customersData.data.data.length === 0
                }
                onColumnOrdering={saveColumnsOrder}
                lockedColumns={["CustomerNumber"]}
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
                >
                  less
                </Link>
                &nbsp;|&nbsp;
                <Link
                  to="/customers"
                  search={(search) => ({
                    ...search,
                    page:
                      pageNumber === customersData.data.totalPages
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
                  totalPages: customersData.data.totalPages,
                  totalRecords: customersData.data.totalRecords,
                })}
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default CustomerSearchPage;
