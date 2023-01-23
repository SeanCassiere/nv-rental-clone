import { useCallback, useMemo } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { agreementSearchRoute } from "../../routes";
import Protector from "../../routes/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import ScrollToTop from "../../components/ScrollToTop";

import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { AgreementFiltersSchema } from "../../utils/schemas/agreement";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { useGetAgreementStatusList } from "../../hooks/network/agreement/useGetAgreementStatusList";
import { type TAgreementListItemParsed } from "../../utils/schemas/agreement";
import { normalizeAgreementListSearchParams } from "../../utils/normalize-search-params";

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

const DateTimeColumns = ["CreatedDate", "CheckoutDate", "CheckinDate"];

function AgreementsSearchPage() {
  const { t } = useTranslation();

  const search = useSearch({ from: agreementSearchRoute.id });
  const { searchFilters, pageNumber, size } =
    normalizeAgreementListSearchParams(search);

  const agreementsData = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const agreementStatusList = useGetAgreementStatusList();

  const columnsData = useGetModuleColumns({ module: "agreements" });

  const columnDefs = useMemo(
    () =>
      columnsData.data.sort(sortColOrderByOrderIndex).map((column) =>
        columnHelper.accessor(column.columnHeader as any, {
          id: column.columnHeader,
          header: () => column.columnHeaderDescription,
          cell: (item) => {
            const value = item.getValue();
            if (column.columnHeader === "AgreementNumber") {
              const agreementId = item.table.getRow(item.row.id).original
                .AgreementId;
              return (
                <Link
                  to="/agreements/$agreementId"
                  params={{ agreementId: String(agreementId) }}
                  className="font-medium text-teal-700"
                  preload="intent"
                >
                  {value}
                </Link>
              );
            }

            if (DateTimeColumns.includes(column.columnHeader)) {
              return t("intlDateTime", { value: new Date(value) });
            }

            return value;
          },
        })
      ),
    [columnsData.data, t]
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "agreements" });

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
          <h1 className="text-2xl font-semibold text-gray-900">Agreements</h1>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            <ModuleSearchFilters
              key={`module-filters-${JSON.stringify(searchFilters).length}`}
              validationSchema={AgreementFiltersSchema}
              initialValues={searchFilters}
              searchFiltersBlueprint={[
                {
                  name: "Statuses",
                  type: "multiple-dropdown",
                  required: false,
                  accessor: "Statuses",
                  label: "Status",
                  options: [
                    { value: "undefined", label: "Select" },
                    ...agreementStatusList.data.map((item) => ({
                      value: `${item.id}`,
                      label: item.name,
                    })),
                  ],
                },
                {
                  name: "IsSearchOverdues",
                  type: "single-dropdown",
                  required: false,
                  accessor: "IsSearchOverdues",
                  label: "Search Overdues?",
                  options: [
                    { value: "true", label: "true" },
                    { value: "false", label: "false" },
                  ],
                },
                {
                  name: "StartDate",
                  type: "date",
                  required: false,
                  accessor: "StartDate",
                  label: "Start date",
                },
                {
                  name: "EndDate",
                  type: "date",
                  required: false,
                  accessor: "EndDate",
                  label: "End date",
                },
                {
                  name: "CustomerId",
                  type: "hidden",
                  required: false,
                  accessor: "CustomerId",
                  label: "CustomerId",
                },
                {
                  name: "VehicleNo",
                  type: "text",
                  required: false,
                  accessor: "VehicleNo",
                  label: "VehicleNo",
                },
                {
                  name: "VehicleId",
                  type: "hidden",
                  required: false,
                  accessor: "VehicleId",
                  label: "VehicleId",
                },
                {
                  name: "SortBy",
                  type: "single-dropdown",
                  required: false,
                  accessor: "SortBy",
                  label: "Sort by",
                  options: [{ value: "CreatedDate", label: "Created date" }],
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
              toLocation="/agreements"
              queryFilterKey="filters"
            />
          </div>

          <div className="shadow">
            <ModuleTable
              // key={`table-cols-${columnDefs.length}`}
              // key={`table-data-length-${
              //   JSON.stringify(columnsData.data).length
              // }`}
              data={agreementsData.data?.data || []}
              columns={columnDefs}
              noRows={
                agreementsData.isLoading === false &&
                agreementsData.data?.data.length === 0
              }
              onColumnOrderChange={handleSaveColumnsOrder}
              lockedColumns={["AgreementNumber"]}
              rawColumnsData={columnsData?.data || []}
              showColumnPicker
              onColumnVisibilityChange={handleSaveColumnVisibility}
            />
          </div>
          <div>
            <p>
              <Link
                to="/agreements"
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
                to="/agreements"
                search={(search) => ({
                  ...search,
                  page:
                    pageNumber === agreementsData.data?.totalPages
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
                totalPages: agreementsData.data?.totalPages,
                totalRecords: agreementsData.data?.totalRecords,
              })}
            </p>
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default AgreementsSearchPage;
