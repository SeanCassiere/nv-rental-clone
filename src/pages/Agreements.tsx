import { Link, useSearch } from "@tanstack/react-router";
import AppShell from "../components/app-shell";
import { useGetAgreementsList } from "../hooks/network/useGetAgreementsList";
import { useGetModuleColumns } from "../hooks/network/useGetModuleColumns";
import Protector from "../routes/Protector";

const Agreements = () => {
  const { page: pageNumber = 1, size = 10 } = useSearch();
  const agreements = useGetAgreementsList({ page: pageNumber, pageSize: size });
  const columns = useGetModuleColumns({ module: "agreements" });

  const noData = { ...agreements.data, data: undefined };
  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Agreements</h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
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
              <div className="mt-5 overflow-x-scroll py-4 text-sm">
                {JSON.stringify(noData)}
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
