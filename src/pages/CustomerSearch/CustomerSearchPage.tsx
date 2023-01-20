import { useEffect } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { customerSearchRoute } from "../../routes";
import Protector from "../../routes/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { CustomerFiltersSchema } from "../../utils/schemas/customer";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import type { TCustomerListItemParsed } from "../../utils/schemas/customer";

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

const DateColumns = ["DateOfbirth", "LicenseExpiryDate"];

function CustomerSearchPage() {
  const { t } = useTranslation();

  const {
    page: pageNumber = 1,
    size = 10,
    filters,
  } = useSearch({
    from: customerSearchRoute.id,
  });

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

  const columnDefs = columnsData.data
    .sort(sortColOrderByOrderIndex)
    .map((column) =>
      columnHelper.accessor(column.columnHeader as any, {
        id: column.columnHeader,
        header: () => column.columnHeaderDescription,
        cell: (item) => {
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
              >
                {item.getValue()}
              </Link>
            );
          }

          if (DateColumns.includes(column.columnHeader)) {
            return t("intlDate", { value: new Date(item.getValue()) });
          }

          return item.getValue();
        },
      })
    );

  const saveColumnsMutation = useSaveModuleColumns({ module: "customers" });

  const handleSaveColumnsOrder = (newColumnOrder: string[]) => {
    saveColumnsMutation.mutate({
      allColumns: columnsData.data,
      accessorKeys: newColumnOrder,
    });
  };

  const handleSaveColumnVisibility = (graph: ColumnVisibilityGraph) => {
    const newColumnsData = columnsData.data.map((col) => {
      col.isSelected = graph[col.columnHeader] || false;
      return col;
    });
    saveColumnsMutation.mutate({ allColumns: newColumnsData });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Protector>
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
              data={customersData.data.data}
              columns={columnDefs}
              noRows={
                customersData.isLoading === false &&
                customersData.data.data.length === 0
              }
              onColumnOrderChange={handleSaveColumnsOrder}
              lockedColumns={["FirstName"]}
              rawColumnsData={columnsData.data}
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
    </Protector>
  );
}

export default CustomerSearchPage;
