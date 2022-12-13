import { Fragment, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable from "../../components/PrimaryModule/ModuleTable";
import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { createColumnHelper } from "@tanstack/react-table";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import type { CustomerListItemType } from "../../types/Customer";

const columnHelper = createColumnHelper<CustomerListItemType>();

function CustomerSearchPage() {
  const { page: pageNumber = 1, size = 10, filters } = useSearch();
  const searchFilters = {
    active: typeof filters?.active !== "undefined" ? filters?.active : true,
  };

  const customersData = useGetCustomersList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const [stateFilters, setStateFilters] = useState(searchFilters);

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
            <div className="my-2 grid grid-cols-8 gap-2 overflow-x-scroll py-4 text-sm">
              {[...Object.entries(stateFilters)].map(([key, value]) => (
                <Fragment key={key}>
                  <div>{key}</div>
                  <div>
                    <input
                      name={(stateFilters as unknown as any)[key]}
                      value={`${value}`}
                      onChange={(evt) => {
                        setStateFilters((prev) => ({
                          ...prev,
                          [key]: evt.target.value,
                        }));
                      }}
                    />
                  </div>
                </Fragment>
              ))}

              <Link
                className="col-span-2 rounded bg-blue-500 py-2 px-4 text-center font-bold text-white hover:bg-blue-700"
                to="/customers"
                search={(s) => {
                  const fill = stateFilters
                    ? Object.entries(stateFilters).reduce(
                        (acc, [key, value]) => {
                          let storeValue: any = value;
                          if (
                            String(value).trim() === "undefined" ||
                            String(value).trim() === "" ||
                            typeof value === "undefined"
                          )
                            return acc;

                          if (String(value) === "true") {
                            storeValue = true;
                          }
                          if (String(value) === "false") {
                            storeValue = false;
                          }
                          if (
                            typeof value === "string" &&
                            /^\d+$/.test(String(value))
                          ) {
                            storeValue = parseInt(value);
                          }

                          return {
                            ...acc,
                            [key]: storeValue,
                          };
                        },
                        {}
                      )
                    : {};

                  return { ...s, page: 1, size: 10, filters: fill };
                }}
              >
                Commit
              </Link>
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
