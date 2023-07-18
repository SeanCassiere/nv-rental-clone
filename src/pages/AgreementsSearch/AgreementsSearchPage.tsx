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
import { PlusIconFilled } from "@/components/icons";

import { searchAgreementsRoute } from "@/routes/agreements/searchAgreements";
import { viewAgreementByIdRoute } from "@/routes/agreements/agreementIdPath";
import { addAgreementRoute } from "@/routes/agreements/addAgreement";

import { useGetAgreementsList } from "@/hooks/network/agreement/useGetAgreementsList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";
import { useGetAgreementStatusList } from "@/hooks/network/agreement/useGetAgreementStatusList";
import { useSaveModuleColumns } from "@/hooks/network/module/useSaveModuleColumns";
import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetAgreementTypesList } from "@/hooks/network/agreement/useGetAgreementTypes";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import {
  PrimaryModuleTable,
  PrimaryModuleTableColumnHeader,
  PrimaryModuleTableCellWrap,
} from "@/components/primary-module/table";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { sortColOrderByOrderIndex } from "@/utils/ordering";
import { type TAgreementListItemParsed } from "@/schemas/agreement";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import { titleMaker } from "@/utils/title-maker";
import { AgreementDateTimeColumns } from "@/utils/columns";
import { cn } from "@/utils";
import { Separator } from "@/components/ui/separator";

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

function AgreementsSearchPage() {
  const { t } = useTranslation();

  const navigate = useNavigate({ from: searchAgreementsRoute.id });

  const search = useSearch({ from: searchAgreementsRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeAgreementListSearchParams(search);

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

  const agreementsData = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const agreementStatusList = useGetAgreementStatusList();
  const agreementStatuses = agreementStatusList.data ?? [];

  const vehicleTypesList = useGetVehicleTypesList();
  const vehicleTypes = vehicleTypesList.data ?? [];

  const locationsList = useGetLocationsList({ locationIsActive: true });
  const locations = locationsList.data?.data ?? [];

  const agreementTypesList = useGetAgreementTypesList();
  const agreementTypes = agreementTypesList.data ?? [];

  const columnsData = useGetModuleColumns({ module: "agreements" });

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
            if (column.columnHeader === "AgreementNumber") {
              const agreementId = item.table.getRow(item.row.id).original
                .AgreementId;
              return (
                <PrimaryModuleTableCellWrap>
                  <Link
                    to={viewAgreementByIdRoute.to}
                    params={{ agreementId: String(agreementId) }}
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
                  {t("intlDateTime", { value: new Date(value) })}
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

  useDocumentTitle(titleMaker("Agreements"));

  return (
    <Protector>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6 text-primary">
            Agreements
          </h1>
          <Link
            to={addAgreementRoute.to}
            search={() => ({ stage: "rental-information" })}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <PlusIconFilled className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline-block">New Agreement</span>
          </Link>
        </div>
        <p className={cn("text-base text-primary/80")}>
          Search through your rentals and view details.
        </p>
        <Separator className="mt-3.5" />
      </section>
      <section className="mx-auto mb-6 mt-4 max-w-full px-2 sm:mb-2 sm:mt-6 sm:px-4">
        <PrimaryModuleTable
          data={agreementsData.data?.data || []}
          columns={columnDefs}
          onColumnOrderChange={handleSaveColumnsOrder}
          rawColumnsData={columnsData?.data || []}
          onColumnVisibilityChange={handleSaveColumnVisibility}
          totalPages={
            agreementsData.data?.totalRecords
              ? Math.ceil(agreementsData.data?.totalRecords / size) ?? -1
              : 0
          }
          pagination={pagination}
          onPaginationChange={(newPaginationState) => {
            navigate({
              to: searchAgreementsRoute.to,
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
                to: searchAgreementsRoute.to,
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
                to: searchAgreementsRoute.to,
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
                  value: `${item.VehicleTypeId}`,
                  label: item.VehicleTypeName,
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
    </Protector>
  );
}

export default AgreementsSearchPage;
