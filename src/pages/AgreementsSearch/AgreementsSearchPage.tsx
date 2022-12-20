import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable, {
  type ColumnVisibilityGraph,
} from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { AgreementFiltersSchema } from "../../utils/schemas/agreement";
import type { AgreementListItemType } from "../../types/Agreement";
import { sortColOrderByOrderIndex } from "../../utils/ordering";

const columnHelper = createColumnHelper<AgreementListItemType>();

const DateTimeColumns = ["CreatedDate", "CheckoutDate", "CheckinDate"];

function AgreementsSearchPage() {
  const { t } = useTranslation();

  const { page: pageNumber = 1, size = 10, filters } = useSearch();
  const searchFilters = {
    AgreementStatusName: filters?.AgreementStatusName || undefined,
    Statuses: filters?.Statuses || undefined,
    IsSearchOverdues:
      typeof filters?.IsSearchOverdues !== "undefined"
        ? filters?.IsSearchOverdues
        : false,
    StartDate: filters?.StartDate || undefined,
    EndDate: filters?.EndDate || undefined,
    SortBy: filters?.SortBy || "CreatedDate",
    SortDirection: filters?.SortDirection || "DESC",
  };

  const agreementsData = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const columnsData = useGetModuleColumns({ module: "agreements" });

  const columnDefs = columnsData.data
    .sort(sortColOrderByOrderIndex)
    .map((column) =>
      columnHelper.accessor(column.columnHeader as any, {
        id: column.columnHeader,
        header: () => column.columnHeaderDescription,
        cell: (item) => {
          if (column.columnHeader === "AgreementNumber") {
            const agreementId = item.table.getRow(item.row.id).original
              .AgreementId;
            return (
              <Link
                to="/agreements/$agreementId"
                params={{ agreementId: String(agreementId) }}
                className="font-medium text-teal-700"
              >
                {item.getValue()}
              </Link>
            );
          }

          if (DateTimeColumns.includes(column.columnHeader)) {
            return t("intlDateTime", { value: new Date(item.getValue()) });
          }

          return item.getValue();
        },
      })
    );

  const saveColumnsMutation = useSaveModuleColumns({ module: "agreements" });

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

  return (
    <Protector>
      <AppShell>
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
                    name: "AgreementStatusName",
                    type: "text",
                    required: false,
                    accessor: "AgreementStatusName",
                    label: "Status Name",
                  },
                  {
                    name: "Statuses",
                    type: "number",
                    required: false,
                    accessor: "Statuses",
                    label: "Status",
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
                key={`table-cols-${columnDefs.length}`}
                data={agreementsData.data.data}
                columns={columnDefs}
                noRows={
                  agreementsData.isLoading === false &&
                  agreementsData.data.data.length === 0
                }
                onColumnOrderChange={handleSaveColumnsOrder}
                lockedColumns={["AgreementNumber"]}
                rawColumnsData={columnsData.data}
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
                >
                  less
                </Link>
                &nbsp;|&nbsp;
                <Link
                  to="/agreements"
                  search={(search) => ({
                    ...search,
                    page:
                      pageNumber === agreementsData.data.totalPages
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
                  totalPages: agreementsData.data.totalPages,
                  totalRecords: agreementsData.data.totalRecords,
                })}
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default AgreementsSearchPage;
