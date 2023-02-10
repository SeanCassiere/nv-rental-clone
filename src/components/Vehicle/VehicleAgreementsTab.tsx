import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import CommonTable from "../General/CommonTable";
import { DocumentTextSolid } from "../icons";
import CommonEmptyStateContent from "../Layout/CommonEmptyStateContent";

import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";

import { type TAgreementListItemParsed } from "../../utils/schemas/agreement";
import { normalizeAgreementListSearchParams } from "../../utils/normalize-search-params";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { AgreementDateTimeColumns } from "../../pages/AgreementsSearch/AgreementsSearchPage";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import { viewAgreementByIdRoute } from "../../routes/agreements/agreementIdPath";
import { searchAgreementsRoute } from "../../routes/agreements/searchAgreements";

interface VehicleReservationsTabProps {
  vehicleId: string;
  vehicleNo: string | undefined;
}

const columnHelper = createColumnHelper<TAgreementListItemParsed>();

const acceptedColumns = [
  "AgreementNumber",
  "AgreementType",
  "AgreementStatusName",
  "FullName",
  "CheckoutDate",
  "CheckinDate",
  "CheckoutLocationName",
  "CheckinLocationName",
];

const pageSize = 50;

const VehicleAgreementsTab = (props: VehicleReservationsTabProps) => {
  const { t } = useTranslation();
  const items = normalizeAgreementListSearchParams({
    page: 1,
    size: pageSize,
    filters: { VehicleNo: props.vehicleNo },
  });

  const columnsData = useGetModuleColumns({ module: "agreements" });

  const dataList = useGetAgreementsList({
    page: items.pageNumber,
    pageSize: items.size,
    filters: items.searchFilters,
  });

  const columnDefs = useMemo(() => {
    const columns: ColumnDef<TAgreementListItemParsed>[] = [];

    columnsData.data.sort(sortColOrderByOrderIndex).forEach((column) => {
      if (acceptedColumns.includes(column.columnHeader) === false) return;

      columns.push(
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
                  to={viewAgreementByIdRoute.fullPath}
                  params={{ agreementId: String(agreementId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-semibold text-slate-800"
                  preload="intent"
                >
                  {value as any}
                </Link>
              );
            }

            if (AgreementDateTimeColumns.includes(column.columnHeader)) {
              return t("intlDateTime", { value: new Date(value as any) });
            }

            return value;
          },
        })
      );
    });

    return columns;
  }, [columnsData.data, t]);

  if (!props.vehicleNo) return null;

  return (
    <div className="max-w-full focus:ring-0">
      {dataList.data?.isRequestMade === false ? null : dataList.data?.data
          .length === 0 ? (
        <CommonEmptyStateContent
          title="No agreements"
          subtitle="You don't have any rental agreements for this vehicle."
          icon={
            <DocumentTextSolid className="mx-auto h-12 w-12 text-slate-400" />
          }
        />
      ) : (
        <div>
          <CommonTable data={dataList.data?.data || []} columns={columnDefs} />
        </div>
      )}

      {dataList.data?.isRequestMade === false ? null : dataList.data?.data
          .length === 0 ? null : (
        <div className="py-4">
          <p className="text-slate-700">
            Showing a maximum of {pageSize} records.
          </p>
          <Link
            to={searchAgreementsRoute.fullPath}
            search={() => ({ filters: { VehicleNo: props.vehicleNo } })}
            className="text-slate-600 underline hover:text-slate-800"
          >
            Need more? Click here to search for agreements.
          </Link>
        </div>
      )}
    </div>
  );
};

export default VehicleAgreementsTab;
