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

import Protector from "@/components/Protector";
import CommonHeader from "@/components/Layout/CommonHeader";

import { searchCustomersRoute } from "@/routes/customers/searchCustomers";
import { viewCustomerByIdRoute } from "@/routes/customers/customerIdPath";

import { useGetCustomersList } from "@/hooks/network/customer/useGetCustomersList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetCustomerTypesList } from "@/hooks/network/customer/useGetCustomerTypes";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import {
  PrimaryModuleTable,
  PrimaryModuleTableColumnHeader,
  PrimaryModuleTableCellWrap,
} from "@/components/primary-module/table";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/utils";
import { sortColOrderByOrderIndex } from "@/utils/ordering";
import type { TCustomerListItemParsed } from "@/schemas/customer";
import { normalizeCustomerListSearchParams } from "@/utils/normalize-search-params";
import { titleMaker } from "@/utils/title-maker";

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

const DateColumns = ["DateOfbirth", "LicenseExpiryDate"];

function CustomerSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate({ from: searchCustomersRoute.id });

  const search = useSearch({ from: searchCustomersRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeCustomerListSearchParams(search);

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
            <PrimaryModuleTableColumnHeader
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
                <PrimaryModuleTableCellWrap>
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
                </PrimaryModuleTableCellWrap>
              );
            }

            if (DateColumns.includes(column.columnHeader)) {
              return (
                <PrimaryModuleTableCellWrap>
                  {t("intlDate", { value: new Date(value) })}
                </PrimaryModuleTableCellWrap>
              );
            }

            return (
              <PrimaryModuleTableCellWrap>{value}</PrimaryModuleTableCellWrap>
            );
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
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 pb-4 pt-1.5 sm:mx-4 sm:px-1">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Customers
              </h1>
            }
            subtitleText="Search through your registered customers and view details."
          />
        </div>
        <Separator className="sm:mx-5" />
        <div className="mx-auto my-4 max-w-full px-2 sm:mb-2 sm:mt-6 sm:px-4">
          <PrimaryModuleTable
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
            filters={{
              columnFilters,
              setColumnFilters,
              onClearFilters: () => {
                navigate({
                  to: searchCustomersRoute.to,
                  params: {},
                  search: () => ({
                    page: 1,
                    size: pagination.pageSize,
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
                  to: searchCustomersRoute.to,
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
                  id: "Keyword",
                  title: "Search",
                  type: "text",
                  size: "large",
                },
                {
                  id: "CustomerTypes",
                  title: "Type",
                  type: "multi-select",
                  options: customerTypesList.data.map((item) => ({
                    value: `${item.typeName}`,
                    label: item.typeName,
                  })),
                  defaultValue: [],
                },
                {
                  id: "DateOfbirth",
                  title: "DOB",
                  type: "date",
                },
                {
                  id: "Phone",
                  title: "Phone",
                  type: "text",
                  size: "normal",
                },
                {
                  id: "Active",
                  title: "Is active?",
                  type: "select",
                  options: [
                    { value: "true", label: "true" },
                    { value: "false", label: "false" },
                  ],
                  defaultValue: "true",
                },
              ],
            }}
          />
        </div>
      </div>
    </Protector>
  );
}

export default CustomerSearchPage;
