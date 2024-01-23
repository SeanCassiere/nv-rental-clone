import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, RouteApi, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import {
  PrimaryModuleTable,
  PrimaryModuleTableCellWrap,
  PrimaryModuleTableColumnHeader,
} from "@/components/primary-module/table";
import { buttonVariants } from "@/components/ui/button";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { saveColumnSettings } from "@/api/save-column-settings";

import type { TCustomerListItemParsed } from "@/schemas/customer";

import { sortColOrderByOrderIndex } from "@/utils/columns";
import { fetchCustomerTypesOptions } from "@/utils/query/customer";
import { titleMaker } from "@/utils/title-maker";

import { cn, getXPaginationFromHeaders } from "@/utils";

const routeApi = new RouteApi({ id: "/_auth/customers" });

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

const DateColumns = ["DateOfbirth", "LicenseExpiryDate"];

export const component = function CustomerSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    search,
    authParams,
    searchListOptions,
    searchColumnsOptions,
    queryClient,
  } = routeApi.useRouteContext();
  const { searchFilters, pageNumber, size } = search;

  const [_trackTableLoading, _setTrackTableLoading] = useState(false);

  const startChangingPage = () => {
    _setTrackTableLoading(true);
  };
  const stopChangingPage = () => {
    _setTrackTableLoading(false);
  };

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

  const customersData = useSuspenseQuery(searchListOptions);
  const customerTypesList = useQuery(
    fetchCustomerTypesOptions({ auth: authParams })
  );
  const customerTypes = customerTypesList.data ?? [];

  const columnsData = useSuspenseQuery(searchColumnsOptions);

  const columnDefs = useMemo(
    () =>
      (columnsData.data.status === 200 ? columnsData.data.body : [])
        .sort(sortColOrderByOrderIndex)
        .map((column) =>
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
                      to="/customers/$customerId"
                      params={{ customerId: String(customerId) }}
                      search={() => ({ tab: "summary" })}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "p-0 text-base"
                      )}
                    >
                      {value || "-"}
                    </Link>
                  </PrimaryModuleTableCellWrap>
                );
              }

              if (DateColumns.includes(column.columnHeader)) {
                return (
                  <PrimaryModuleTableCellWrap>
                    {t("intlDate", { value: new Date(value), ns: "format" })}
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

  const saveColumnsMutation = useMutation({
    mutationFn: saveColumnSettings,
    onMutate: () =>
      queryClient.cancelQueries({ queryKey: searchColumnsOptions.queryKey }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: searchColumnsOptions.queryKey,
      }),
    onError: () =>
      queryClient.invalidateQueries({
        queryKey: searchColumnsOptions.queryKey,
      }),
  });

  const handleSaveColumnsOrder = useCallback(
    (newColumnOrder: ColumnOrderState) => {
      saveColumnsMutation.mutate({
        auth: authParams,
        module: "customers",
        allColumns:
          columnsData.data.status === 200 ? columnsData.data.body : [],
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation, authParams]
  );

  const handleSaveColumnVisibility = useCallback(
    (graph: VisibilityState) => {
      const newColumnsData = (
        columnsData.data.status === 200 ? columnsData.data.body : []
      ).map((col) => {
        col.isSelected = graph[col.columnHeader] || false;
        return col;
      });
      saveColumnsMutation.mutate({
        auth: authParams,
        module: "customers",
        allColumns: newColumnsData,
      });
    },
    [columnsData.data, saveColumnsMutation, authParams]
  );

  const parsedPagination =
    customersData.status === "success"
      ? customersData.data.pagination
      : getXPaginationFromHeaders(null);

  const customersList =
    customersData.data?.status === 200 ? customersData.data?.body : [];

  useDocumentTitle(titleMaker("Customers"));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6">Customers</h1>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Search through your customers and view details.
        </p>
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <PrimaryModuleTable
          data={customersList}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          isLoading={customersData.isLoading || _trackTableLoading}
          rawColumnsData={
            columnsData.data.status === 200 ? columnsData.data.body : []
          }
          onColumnVisibilityChange={handleSaveColumnVisibility}
          totalPages={
            parsedPagination?.totalRecords
              ? Math.ceil(parsedPagination?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            startChangingPage();
            navigate({
              to: "/customers",
              params: {},
              search: (current) => ({
                ...current,
                page: newPaginationState.pageIndex + 1,
                size: newPaginationState.pageSize,
                filters: searchFilters,
              }),
            }).then(stopChangingPage);
          }}
          filters={{
            columnFilters,
            setColumnFilters,
            onClearFilters: () => {
              startChangingPage();
              navigate({
                to: "/customers",
                params: {},
                search: () => ({
                  page: 1,
                  size: pagination.pageSize,
                }),
              }).then(stopChangingPage);
            },
            onSearchWithFilters: () => {
              const filters = columnFilters.reduce(
                (prev, current) => ({
                  ...prev,
                  [current.id]: current.value,
                }),
                {}
              );
              startChangingPage();
              navigate({
                to: "/customers",
                params: {},
                search: () => ({
                  page: 1,
                  size: pagination.pageSize,
                  filters,
                }),
              }).then(stopChangingPage);
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
                options: customerTypes.map((item) => ({
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
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ],
                defaultValue: "true",
              },
            ],
          }}
        />
      </section>
    </>
  );
};
