import React from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationLinkNext,
  PaginationLinkPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { saveColumnSettings } from "@/lib/api/save-column-settings";
import type { TAgreementListItemParsed } from "@/lib/schemas/agreement";
import {
  fetchAgreementStatusesOptions,
  fetchAgreementTypesOptions,
} from "@/lib/query/agreement";
import { fetchLocationsListOptions } from "@/lib/query/location";
import { fetchVehiclesTypesOptions } from "@/lib/query/vehicle";

import {
  TableList,
  TableListColumnVisibilityDropdown,
  TableListContent,
  TableListPaginationItems,
  TableListPaginationNext,
  TableListPaginationPrevious,
  TableListToolbar,
  TableListToolbarActions,
  TableListToolbarFilters,
  type TableListToolbarFilterItem,
} from "@/routes/_auth/-modules/table-list";

import {
  AgreementDateTimeColumns,
  sortColOrderByOrderIndex,
} from "@/lib/utils/columns";
import { getXPaginationFromHeaders } from "@/lib/utils/headers";
import { insertSpacesBeforeCaps } from "@/lib/utils/random";
import { cn } from "@/lib/utils/styles";
import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute("/_auth/(agreements)/agreements/")({
  component: AgreementsSearchPage,
});

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

const routeApi = getRouteApi("/_auth/agreements/");

function AgreementsSearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/agreements" });

  const {
    searchColumnsOptions,
    searchListOptions,
    search,
    authParams,
    queryClient,
  } = routeApi.useRouteContext();
  const { searchFilters, pageNumber, size } = search;

  const [columnFilters, handleColumnFiltersChange] =
    React.useState<ColumnFiltersState>(() =>
      Object.entries(searchFilters).reduce(
        (prev, [key, value]) => [...prev, { id: key, value }],
        [] as ColumnFiltersState
      )
    );

  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: pageNumber === 0 ? 0 : pageNumber - 1,
      pageSize: size,
    }),
    [pageNumber, size]
  );

  const agreementsData = useQuery(searchListOptions);

  const agreementStatusList = useQuery(
    fetchAgreementStatusesOptions({ auth: authParams })
  );
  const agreementStatuses = React.useMemo(
    () => agreementStatusList.data ?? [],
    [agreementStatusList.data]
  );

  const vehicleTypesList = useQuery(
    fetchVehiclesTypesOptions({ auth: authParams })
  );
  const vehicleTypes = React.useMemo(
    () => vehicleTypesList.data ?? [],
    [vehicleTypesList.data]
  );

  const locationsList = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
    })
  );
  const locations = React.useMemo(
    () => (locationsList.data?.status === 200 ? locationsList.data.body : []),
    [locationsList.data?.body, locationsList.data?.status]
  );

  const agreementTypesList = useQuery(
    fetchAgreementTypesOptions({ auth: authParams })
  );
  const agreementTypes = React.useMemo(
    () => agreementTypesList.data ?? [],
    [agreementTypesList.data]
  );

  const columnsData = useSuspenseQuery(searchColumnsOptions);

  const columnDefs = React.useMemo(
    () =>
      (columnsData.data.status === 200 ? columnsData.data.body : [])
        .sort(sortColOrderByOrderIndex)
        .map((column) =>
          columnHelper.accessor(
            column.columnHeader as keyof TAgreementListItemParsed,
            {
              id: column.columnHeader,
              meta: {
                columnName: column.columnHeaderDescription ?? "",
              },
              header: () => column.columnHeaderDescription ?? "",
              cell: (item) => {
                const value = item.getValue();

                if (column.columnHeader === "AgreementNumber") {
                  const agreementId = item.table.getRow(item.row.id).original
                    .AgreementId;

                  return (
                    <Link
                      to="/agreements/$agreementId"
                      params={{ agreementId: String(agreementId) }}
                      search={() => ({ tab: "summary" })}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "p-0 text-base"
                      )}
                    >
                      {value || "-"}
                    </Link>
                  );
                }

                if (column.columnHeader === "AgreementStatusName") {
                  return (
                    <Badge variant="outline">
                      {insertSpacesBeforeCaps(String(value))}
                    </Badge>
                  );
                }

                if (
                  AgreementDateTimeColumns.includes(column.columnHeader) &&
                  value
                ) {
                  return t("intlDateTime", {
                    value: new Date(value),
                    ns: "format",
                  });
                }

                return value ?? "-";
              },
              enableSorting: false,
              enableHiding: column.columnHeader !== "AgreementNumber",
            }
          )
        ),
    [columnsData.data.body, columnsData.data.status, t]
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

  const handleColumnOrderChange = React.useCallback(
    (newColumnOrder: ColumnOrderState) => {
      saveColumnsMutation.mutate({
        auth: authParams,
        module: "agreements",
        allColumns:
          columnsData.data.status === 200 ? columnsData.data.body : [],
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation, authParams]
  );

  const handleColumnVisibilityChange = React.useCallback(
    (graph: VisibilityState) => {
      const newColumnsData = (
        columnsData.data.status === 200 ? columnsData.data.body : []
      ).map((col) => {
        col.isSelected = graph[col.columnHeader] || false;
        return col;
      });
      saveColumnsMutation.mutate({
        auth: authParams,
        module: "agreements",
        allColumns: newColumnsData,
      });
    },
    [columnsData.data, saveColumnsMutation, authParams]
  );

  const handleClearFilters = React.useCallback(() => {
    navigate({
      to: "/agreements",
      params: {},
      search: () => ({
        page: 1,
        size: pagination.pageSize,
      }),
    });
  }, [navigate, pagination.pageSize]);

  const handleSearchFilters = React.useCallback(() => {
    const filters = columnFilters.reduce(
      (prev, current) => ({
        ...prev,
        [current.id]: current.value,
      }),
      {}
    );
    navigate({
      to: "/agreements",
      params: {},
      search: () => ({
        page: 1,
        size: pagination.pageSize,
        filters,
      }),
    });
  }, [columnFilters, navigate, pagination.pageSize]);

  const columnVisibility: VisibilityState = React.useMemo(
    () =>
      columnsData.data.status === 200
        ? columnsData.data.body.reduce(
            (prev, current) => ({
              ...prev,
              [current.columnHeader]: current.isSelected,
            }),
            {}
          )
        : {},
    [columnsData.data?.body, columnsData.data?.status]
  );

  const parsedPagination =
    agreementsData.status === "success"
      ? agreementsData.data.pagination
      : getXPaginationFromHeaders(null);

  const tableFacetedFilters: TableListToolbarFilterItem[] = React.useMemo(
    () => [
      {
        id: "CustomerId",
        title: "CustomerId",
        type: "hidden",
      },
      {
        id: "VehicleId",
        title: "VehicleId",
        type: "hidden",
      },
      {
        id: "AgreementNumber",
        title: "AgreementNumber",
        type: "hidden",
      },
      {
        id: "Keyword",
        title: "Search",
        type: "text",
        size: "large",
      },
      {
        id: "Statuses",
        title: "Status",
        type: "multi-select",
        options: agreementStatuses.map((item) => ({
          value: `${item.id}`,
          label: insertSpacesBeforeCaps(item.name),
        })),
        defaultValue: [],
      },
      {
        id: "AgreementTypes",
        title: "Type",
        type: "multi-select",
        options: agreementTypes.map((item) => ({
          value: `${item.typeName}`,
          label: item.typeName,
        })),
        defaultValue: [],
      },
      {
        id: "StartDate",
        title: "Start date",
        type: "date",
      },
      {
        id: "EndDate",
        title: "End date",
        type: "date",
      },
      {
        id: "PickupLocationId",
        title: "Checkout location",
        type: "select",
        options: locations.map((item) => ({
          value: `${item.locationId}`,
          label: `${item.locationName}`,
        })),
      },
      {
        id: "ReturnLocationId",
        title: "Checkin location",
        type: "select",
        options: locations.map((item) => ({
          value: `${item.locationId}`,
          label: `${item.locationName}`,
        })),
      },
      {
        id: "VehicleTypeId",
        title: "Vehicle type",
        type: "select",
        options: vehicleTypes.map((item) => ({
          value: `${item.id}`,
          label: item.value,
        })),
      },
      {
        id: "VehicleNo",
        title: "Vehicle no.",
        type: "text",
        size: "normal",
      },
      {
        id: "IsSearchOverdues",
        title: "Only overdues?",
        type: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        defaultValue: "false",
      },
      {
        id: "SortBy",
        title: "Sort by",
        type: "select",
        options: [{ value: "CreatedDate", label: "Created date" }],
        defaultValue: "CreatedDate",
      },
      {
        id: "SortDirection",
        title: "Sort direction",
        type: "select",
        options: [
          { value: "ASC", label: "Asc" },
          { value: "DESC", label: "Desc" },
        ],
        defaultValue: "DESC",
      },
    ],
    [agreementStatuses, agreementTypes, locations, vehicleTypes]
  );

  const dataList = React.useMemo(
    () => (agreementsData.data?.status === 200 ? agreementsData.data.body : []),
    [agreementsData.data?.body, agreementsData.data?.status]
  );

  useDocumentTitle(titleMaker("Agreements"));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <h1 className="text-2xl font-semibold leading-6">Agreements</h1>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to="/agreements/new"
              search={() => ({ stage: "rental-information" })}
              className={cn(buttonVariants({ size: "sm" }), "w-max")}
            >
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>New Agreement</span>
            </Link>
          </div>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Search through your rentals and view details.
        </p>
      </section>

      <section className="mx-auto my-4 max-w-full px-2 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4">
        <TableList
          list={dataList}
          columnDefs={columnDefs}
          isLoading={agreementsData.isLoading}
          filtering={{
            columnFilters,
            onColumnFiltersChange: handleColumnFiltersChange,
          }}
          visibility={{
            columnVisibility,
            onColumnVisibilityChange: handleColumnVisibilityChange,
          }}
          ordering={{
            onColumnOrderChange: handleColumnOrderChange,
          }}
          pagination={{
            pagination,
            totalPages: parsedPagination.totalRecords
              ? Math.ceil(parsedPagination?.totalRecords / size) ?? -1
              : 0,
          }}
        >
          <TableListToolbar
            filterItems={tableFacetedFilters}
            onSearchWithFilters={handleSearchFilters}
            onClearFilters={handleClearFilters}
            className="flex flex-wrap items-start justify-start gap-2"
          >
            <TableListToolbarFilters />
            <TableListToolbarActions className="inline-flex justify-start gap-2" />
          </TableListToolbar>
          <Separator className="my-4" />
          <div className="flex items-center justify-end">
            <TableListColumnVisibilityDropdown />
          </div>
          <div className="mt-2.5 overflow-hidden rounded-md border bg-card">
            <TableListContent />
          </div>
          <Pagination className="mt-2.5">
            <PaginationContent className="rounded-md border bg-card px-1 py-0.5 md:px-2 md:py-1">
              <TableListPaginationPrevious>
                {(state) => (
                  <PaginationLinkPrevious
                    disabled={state.disabled}
                    className={cn(
                      state.disabled ? "cursor-not-allowed opacity-60" : ""
                    )}
                    to="/agreements"
                    search={(prev) => ({
                      ...prev,
                      page: state.pagination.pageIndex + 1,
                      size: state.pagination.pageSize,
                      filters: searchFilters,
                    })}
                    params
                  />
                )}
              </TableListPaginationPrevious>

              <TableListPaginationItems className="hidden sm:inline-block">
                {({ pagination, isActive }) => (
                  <PaginationLink
                    to="/agreements"
                    search={(prev) => ({
                      ...prev,
                      page: pagination.pageIndex + 1,
                      size: pagination.pageSize,
                      filters: searchFilters,
                    })}
                    isActive={isActive}
                    params
                  >
                    {pagination.pageIndex + 1}
                  </PaginationLink>
                )}
              </TableListPaginationItems>

              <TableListPaginationNext>
                {(state) => (
                  <PaginationLinkNext
                    disabled={state.disabled}
                    className={cn(
                      state.disabled ? "cursor-not-allowed opacity-60" : ""
                    )}
                    to="/agreements"
                    search={(prev) => ({
                      ...prev,
                      page: state.pagination.pageIndex + 1,
                      size: state.pagination.pageSize,
                      filters: searchFilters,
                    })}
                    params
                  />
                )}
              </TableListPaginationNext>
            </PaginationContent>
          </Pagination>
        </TableList>
      </section>
    </>
  );
}
