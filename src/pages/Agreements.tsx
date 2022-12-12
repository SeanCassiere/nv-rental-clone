import { Link, useSearch } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import AppShell from "../components/app-shell";
import { useGetAgreementsList } from "../hooks/network/useGetAgreementsList";
import { useGetModuleColumns } from "../hooks/network/useGetModuleColumns";
import Protector from "../routes/Protector";

const Agreements = () => {
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

  const agreements = useGetAgreementsList({
    page: pageNumber,
    pageSize: size,
    filters: searchFilters,
  });

  const [stateFilters, setStateFilters] = useState(searchFilters);

  const columns = useGetModuleColumns({ module: "agreements" });

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
            <div className="py-4">
              <div>
                <Link
                  to="/agreements"
                  search={(search) => ({
                    ...search,
                    page: pageNumber <= 1 ? 1 : pageNumber - 1,
                    size,
                  })}
                >
                  Page -1
                </Link>
                <Link
                  to="/agreements"
                  search={(search) => ({
                    ...search,
                    page: pageNumber + 1,
                    size,
                  })}
                >
                  Page +1
                </Link>
              </div>

              <div className="mt-5 overflow-x-scroll py-4 text-sm">
                <div>Columns</div>
                {columns.data
                  .filter((col) => col.isSelected)
                  .sort((col1, col2) => col1.orderIndex - col2.orderIndex)
                  .map((col, i) => (
                    <span key={col.columnHeader + i} className="mr-1">
                      {col.columnHeader}
                    </span>
                  ))}
              </div>
              <div className="mt-10">
                {agreements.data.data.map((agreement) => (
                  <div
                    key={agreement.AgreementId}
                    className="my-4 flex gap-2 border-2 border-dashed border-gray-400 py-3"
                  >
                    <span>{agreement.AgreementNumber}</span>
                    <span>{agreement.AgreementStatusName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
};

export default Agreements;
