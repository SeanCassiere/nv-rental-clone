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

import { PrimaryModuleTable } from "@/components/primary-module/table";
import type { PrimaryModuleTableFacetedFilterItem } from "@/components/primary-module/table-filter";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

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
  AgreementDateTimeColumns,
  sortColOrderByOrderIndex,
} from "@/lib/utils/columns";
import { titleMaker } from "@/lib/utils/title-maker";

import { cn, getXPaginationFromHeaders } from "@/lib/utils";

export const Route = createLazyFileRoute("/_auth/agreements/")({
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

  const [_trackTableLoading, _setTrackTableLoading] = React.useState(false);

  const startChangingPage = () => {
    _setTrackTableLoading(true);
  };
  const stopChangingPage = () => {
    _setTrackTableLoading(false);
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () =>
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
                  return <Badge variant="outline">{String(value)}</Badge>;
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

  const handleSaveColumnsOrder = React.useCallback(
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

  const handleSaveColumnVisibility = React.useCallback(
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

  const parsedPagination =
    agreementsData.status === "success"
      ? agreementsData.data.pagination
      : getXPaginationFromHeaders(null);

  const tableFacetedFilters: PrimaryModuleTableFacetedFilterItem[] =
    React.useMemo(
      () => [
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
            label: item.name,
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
        <PrimaryModuleTable
          data={dataList}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          isLoading={agreementsData.isLoading || _trackTableLoading}
          initialColumnVisibility={
            columnsData.data.status === 200
              ? columnsData.data.body.reduce(
                  (prev, current) => ({
                    ...prev,
                    [current.columnHeader]: current.isSelected,
                  }),
                  {}
                )
              : {}
          }
          onColumnVisibilityChange={handleSaveColumnVisibility}
          totalPages={
            parsedPagination.totalRecords
              ? Math.ceil(parsedPagination?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            startChangingPage();
            navigate({
              to: "/agreements",
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
              startChangingPage;
              navigate({
                to: "/agreements",
                params: {},
                search: () => ({
                  page: 1,
                  size: pagination.pageSize,
                }),
              }).then(stopChangingPage);
            },
            onSearchWithFilters: () => {
              startChangingPage();
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
              }).then(stopChangingPage);
            },
            filterableColumns: tableFacetedFilters,
          }}
        />
      </section>
    </>
  );
}
