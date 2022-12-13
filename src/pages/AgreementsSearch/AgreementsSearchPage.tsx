import { Link, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Fragment, useMemo, useState } from "react";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import { useGetAgreementsList } from "../../hooks/network/useGetAgreementsList";
import { useGetModuleColumns } from "../../hooks/network/useGetModuleColumns";
import type { AgreementListItemType } from "../../types/Agreement";
import ModuleTable from "../../components/PrimaryModule/ModuleTable";

const columnHelper = createColumnHelper<AgreementListItemType>();

function AgreementsSearchPage() {
  const { page: pageNumber = 1, size = 10, filters } = useSearch();
  const searchFilters = {
    AgreementStatusName: filters?.AgreementStatusName || undefined,
    Statuses: filters?.Statuses || undefined,
    IsSearchOverdues:
      typeof filters?.IsSearchOverdues !== "undefined"
        ? filters?.IsSearchOverdues
        : undefined,
    EndDate: filters?.EndDate || undefined,
  };

  const agreementsData = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const [stateFilters, setStateFilters] = useState(searchFilters);

  const columnsData = useGetModuleColumns({ module: "agreements" });

  const columns = useMemo(() => {
    const data = columnsData.data
      .filter((col) => col.isSelected)
      .sort((col1, col2) => col1.orderIndex - col2.orderIndex);
    const cols = data.map((column) => {
      return columnHelper.accessor(column.columnHeader as any, {
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
      });
    });
    return cols;
  }, [columnsData.data]);

  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Agreements</h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div className="my-2 grid max-w-[400px] grid-cols-2 gap-2 overflow-x-scroll py-4 text-sm">
              {[...Object.entries(stateFilters)].map(([key, value]) => (
                <Fragment key={key}>
                  <div>{key}</div>
                  <div>
                    <input
                      name={(stateFilters as unknown as any)[key]}
                      value={`${value}`}
                      onChange={(evt) => {
                        setStateFilters((prev) => ({
                          ...prev,
                          [key]: evt.target.value,
                        }));
                      }}
                    />
                  </div>
                </Fragment>
              ))}

              <Link
                className="col-span-2 rounded bg-blue-500 py-2 px-4 text-center font-bold text-white hover:bg-blue-700"
                to="/agreements"
                search={(s) => {
                  const fill = stateFilters
                    ? Object.entries(stateFilters).reduce(
                        (acc, [key, value]) => {
                          let storeValue = value;
                          if (
                            String(value).trim() === "undefined" ||
                            String(value).trim() === "" ||
                            typeof value === "undefined"
                          )
                            return acc;

                          if (String(value) === "true") {
                            storeValue = true;
                          }
                          if (String(value) === "false") {
                            storeValue = false;
                          }
                          if (
                            typeof value === "string" &&
                            /^\d+$/.test(String(value))
                          ) {
                            storeValue = parseInt(value);
                          }

                          return {
                            ...acc,
                            [key]: storeValue,
                          };
                        },
                        {}
                      )
                    : {};

                  return { ...s, page: 1, size: 10, filters: fill };
                }}
              >
                Commit
              </Link>
            </div>

            <div>
              <ModuleTable
                data={agreementsData.data.data}
                columns={columns}
                noRows={
                  agreementsData.isLoading === false &&
                  agreementsData.data.data.length === 0
                }
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
