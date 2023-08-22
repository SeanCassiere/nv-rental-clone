import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CommonTable } from "@/components/common/common-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";

import { useGetAgreementsList } from "@/hooks/network/agreement/useGetAgreementsList";
import { useGetModuleColumns } from "@/hooks/network/module/useGetModuleColumns";

import { viewAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";
import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";

import { type TAgreementListItemParsed } from "@/schemas/agreement";

import { AgreementDateTimeColumns } from "@/utils/columns";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import { sortColOrderByOrderIndex } from "@/utils/ordering";

interface FleetOccupiedAgreementsTabProps {
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

const FleetOccupiedAgreementsTab = (props: FleetOccupiedAgreementsTabProps) => {
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

    (columnsData.data.status === 200 ? columnsData.data.body : [])
      .sort(sortColOrderByOrderIndex)
      .forEach((column) => {
        if (acceptedColumns.includes(column.columnHeader) === false) return;

        columns.push(
          columnHelper.accessor(column.columnHeader as any, {
            id: column.columnHeader,
            header: ({ column: columnChild }) => (
              <DataTableColumnHeader
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
                  <Link
                    to={viewAgreementByIdRoute.to}
                    params={{ agreementId: String(agreementId) }}
                    search={() => ({ tab: "summary" })}
                    className="font-semibold text-slate-800"
                    preload="intent"
                  >
                    {value as any}
                  </Link>
                );
              }
              if (column.columnHeader === "AgreementStatusName") {
                return <Badge variant="outline">{String(value)}</Badge>;
              }

              if (AgreementDateTimeColumns.includes(column.columnHeader)) {
                return t("intlDateTime", {
                  value: new Date(value as any),
                  ns: "format",
                });
              }

              return value;
            },
            enableHiding: false,
            enableSorting: false,
          })
        );
      });

    return columns;
  }, [columnsData.data, t]);

  if (!props.vehicleNo) return null;

  return (
    <div className="max-w-full focus:ring-0">
      <CommonTable data={dataList.data?.data || []} columns={columnDefs} />

      {dataList.data?.isRequestMade === false ? null : dataList.data?.data
          .length === 0 ? null : (
        <div className="py-4">
          <p className="text-slate-700">
            Showing a maximum of {pageSize} records.
          </p>
          <Link
            to={searchAgreementsRoute.to}
            search={(prev) => ({
              ...prev,
              filters: { VehicleNo: props.vehicleNo },
            })}
            className="text-slate-600 underline hover:text-slate-800"
          >
            Need more? Click here to search for agreements.
          </Link>
        </div>
      )}
    </div>
  );
};

export default FleetOccupiedAgreementsTab;
