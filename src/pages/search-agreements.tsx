import { useCallback, useMemo, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, RouteApi, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import {
  PrimaryModuleTable,
  PrimaryModuleTableCellWrap,
  PrimaryModuleTableColumnHeader,
} from "@/components/primary-module/table";
import ProtectorShield from "@/components/protector-shield";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetVehicleTypesLookupList } from "@/hooks/network/vehicle-type/useGetVehicleTypesLookup";

import type { TAgreementListItemParsed } from "@/schemas/agreement";

import { getAuthFromAuthHook } from "@/utils/auth";
import { AgreementDateTimeColumns } from "@/utils/columns";
import { sortColOrderByOrderIndex } from "@/utils/ordering";
import {
  fetchAgreementsSearchListOptions,
  fetchAgreementStatusesOptions,
  fetchAgreementTypesOptions,
} from "@/utils/query/agreement";
import { titleMaker } from "@/utils/title-maker";

import { cn, getXPaginationFromHeaders } from "@/utils";

const routeApi = new RouteApi({ id: "/agreements/" });

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

function AgreementsSearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const { searchColumnsOptions, search } = routeApi.useRouteContext();
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

  const agreementsData = useQuery(
    fetchAgreementsSearchListOptions({
      auth: authParams,
      pagination: {
        page: pageNumber,
        pageSize: size,
      },
      filters: {
        ...searchFilters,
        currentDate: new Date(),
      },
    })
  );

  const agreementStatusList = useQuery(
    fetchAgreementStatusesOptions({ auth: authParams })
  );
  const agreementStatuses = agreementStatusList.data ?? [];

  const vehicleTypesList = useGetVehicleTypesLookupList();
  const vehicleTypes = vehicleTypesList.data ?? [];

  const locationsList = useGetLocationsList({
    query: { withActive: true },
  });
  const locations =
    locationsList.data?.status === 200 ? locationsList.data.body : [];

  const agreementTypesList = useQuery(
    fetchAgreementTypesOptions({ auth: authParams })
  );
  const agreementTypes = agreementTypesList.data ?? [];

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
              if (column.columnHeader === "AgreementNumber") {
                const agreementId = item.table.getRow(item.row.id).original
                  .AgreementId;
                return (
                  <PrimaryModuleTableCellWrap>
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
                  </PrimaryModuleTableCellWrap>
                );
              }
              if (column.columnHeader === "AgreementStatusName") {
                return (
                  <PrimaryModuleTableCellWrap>
                    <Badge variant="outline">{String(value)}</Badge>
                  </PrimaryModuleTableCellWrap>
                );
              }
              if (AgreementDateTimeColumns.includes(column.columnHeader)) {
                return (
                  <PrimaryModuleTableCellWrap>
                    {t("intlDateTime", {
                      value: new Date(value),
                      ns: "format",
                    })}
                  </PrimaryModuleTableCellWrap>
                );
              }
              return (
                <PrimaryModuleTableCellWrap>{value}</PrimaryModuleTableCellWrap>
              );
            },
            enableSorting: false,
            enableHiding: column.columnHeader !== "AgreementNumber",
          })
        ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "agreements" });

  const handleSaveColumnsOrder = useCallback(
    (newColumnOrder: ColumnOrderState) => {
      saveColumnsMutation.mutate({
        allColumns:
          columnsData.data.status === 200 ? columnsData.data.body : [],
        accessorKeys: newColumnOrder,
      });
    },
    [columnsData.data, saveColumnsMutation]
  );

  const handleSaveColumnVisibility = useCallback(
    (graph: VisibilityState) => {
      const newColumnsData = (
        columnsData.data.status === 200 ? columnsData.data.body : []
      ).map((col) => {
        col.isSelected = graph[col.columnHeader] || false;
        return col;
      });
      saveColumnsMutation.mutate({ allColumns: newColumnsData });
    },
    [columnsData.data, saveColumnsMutation]
  );

  const headers = agreementsData.data?.headers ?? new Headers();
  const parsedPagination = getXPaginationFromHeaders(headers);

  const agreementsList =
    agreementsData.data?.status === 200 ? agreementsData.data.body : [];

  useDocumentTitle(titleMaker("Agreements"));

  return (
    <ProtectorShield>
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
          data={agreementsList}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          isLoading={agreementsData.isLoading || _trackTableLoading}
          rawColumnsData={
            columnsData.data.status === 200 ? columnsData.data.body : []
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
            filterableColumns: [
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
          }}
        />
      </section>
    </ProtectorShield>
  );
}

export default AgreementsSearchPage;
