import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import ModuleTable from "../../components/PrimaryModule/ModuleTable";
import ModuleSearchFilters from "../../components/PrimaryModule/ModuleSearchFilters";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";
import { useSaveModuleColumns } from "../../hooks/network/module/useSaveModuleColumns";
import { agreementFiltersModel } from "../../utils/schemas/agreement";
import type { AgreementListItemType } from "../../types/Agreement";

const columnHelper = createColumnHelper<AgreementListItemType>();

function AgreementsSearchPage() {
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
  };

  const agreementsData = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const columnsData = useGetModuleColumns({ module: "agreements" });

  const visibleOrderedColumns = columnsData.data
    .filter((col) => col.isSelected)
    .sort((col1, col2) => col1.orderIndex - col2.orderIndex);

  const columnDefs = visibleOrderedColumns.map((column) =>
    columnHelper.accessor(column.columnHeader as any, {
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

        return item.getValue();
      },
    })
  );

  const saveColumnsMutation = useSaveModuleColumns({ module: "agreements" });

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
            <h1 className="text-2xl font-semibold text-gray-900">Agreements</h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div className="my-2 py-4">
              <ModuleSearchFilters
                key={`module-filters-${JSON.stringify(searchFilters).length}`}
                validationSchema={agreementFiltersModel}
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
                ]}
                persistSearchFilters={{ page: 1, size: 10 }}
                toLocation="/agreements"
                queryFilterKey="filters"
              />
            </div>

            <div>
              <ModuleTable<AgreementListItemType>
                key={`table-cols-${columnDefs.length}`}
                data={agreementsData.data.data}
                columns={columnDefs}
                noRows={
                  agreementsData.isLoading === false &&
                  agreementsData.data.data.length === 0
                }
                onColumnOrdering={saveColumnsOrder}
                lockedColumns={["AgreementNumber"]}
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
