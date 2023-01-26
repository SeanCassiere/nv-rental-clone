import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import CommonTable from "../General/CommonTable";

import { useGetModuleColumns } from "../../hooks/network/module/useGetModuleColumns";

import { type TAgreementListItemParsed } from "../../utils/schemas/agreement";
import { normalizeAgreementListSearchParams } from "../../utils/normalize-search-params";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { AgreementDateTimeColumns } from "../../pages/AgreementsSearch/AgreementsSearchPage";
import { useGetAgreementsList } from "../../hooks/network/agreement/useGetAgreementsList";
import { viewAgreementRoute } from "../../routes/agreements/viewAgreement";

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

const VehicleAgreementsTab = (props: VehicleReservationsTabProps) => {
  const { t } = useTranslation();
  const items = normalizeAgreementListSearchParams({
    page: 1,
    size: 50,
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
                  to={viewAgreementRoute.id}
                  params={{ agreementId: String(agreementId) }}
                  search={() => ({ tab: "summary" })}
                  className="font-medium text-slate-800"
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
      <CommonTable data={dataList.data.data || []} columns={columnDefs} />
      <div className="py-4">
        <Link
          to="/agreements"
          search={() => ({ filters: { VehicleNo: props.vehicleNo } })}
          className="text-slate-600"
        >
          Need more filters? Click here to search for agreements.
        </Link>
      </div>
    </div>
  );
};

export default VehicleAgreementsTab;
