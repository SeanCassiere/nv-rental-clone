import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/router";
import parseISO from "date-fns/parseISO";
import { FilesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useGetVehicleExchanges } from "@/hooks/network/vehicle-exchange/useGetVehicleExchanges";

import { viewFleetByIdRoute } from "@/routes/fleet/fleet-id-route";

import { type TVehicleExchangeListItemParsed } from "@/schemas/vehicleExchange";

import { CommonTable } from "../../../common/common-table";
import CommonEmptyStateContent from "../../../Layout/CommonEmptyStateContent";

const columnHelper = createColumnHelper<TVehicleExchangeListItemParsed>();
type TVehicleExchangeKeyHelp = {
  type: "text" | "date-time" | "link-old-vehicle";
  accessor: keyof TVehicleExchangeListItemParsed;
  header: string;
};

const agreementExchangeColumns: TVehicleExchangeKeyHelp[] = [
  {
    type: "link-old-vehicle",
    accessor: "orgVehicleViewName",
    header: "Original vehicle",
  },
  { type: "text", accessor: "orgVehicleStatus", header: "Status" },
  { type: "text", accessor: "orgVehicleOdometerIn", header: "Odometer in" },
  { type: "text", accessor: "orgVehicleFuelLevelIn", header: "Fuel in" },
  { type: "text", accessor: "newVehicleViewName", header: "New vehicle" },
  { type: "text", accessor: "newVehicleOdometerOut", header: "Odometer out" },
  { type: "text", accessor: "newVehicleFuelLevelOut", header: "Fuel out" },
  { type: "date-time", accessor: "exchangeDate", header: "Exchange date" },
  { type: "text", accessor: "createdByName", header: "Created by" },
];

const AgreementExchangesTab = ({ referenceId }: { referenceId: string }) => {
  const { t } = useTranslation();

  const dataList = useGetVehicleExchanges({ agreementId: referenceId });

  const colDefs = useMemo(() => {
    const columns: ColumnDef<TVehicleExchangeListItemParsed>[] = [];

    const pushToColumns = (localColumns: TVehicleExchangeKeyHelp[]) => {
      localColumns.forEach((column) => {
        columns.push(
          columnHelper.accessor(column.accessor as any, {
            id: column.header,
            header: () => column.header,
            cell: (item) => {
              const value = item.getValue();

              if (column.type === "link-old-vehicle") {
                const vehicleId = item.table.getRow(item.row.id).original
                  .orgVehicleId;

                return (
                  <Link
                    to={viewFleetByIdRoute.to}
                    params={{ vehicleId: `${vehicleId}` }}
                    search={() => ({ tab: "summary" })}
                    className="font-semibold text-slate-800"
                    preload="intent"
                  >
                    {String(value)}
                  </Link>
                );
              }

              if (column.type === "date-time" && typeof value === "string") {
                return t("intlDateTime", {
                  value: parseISO(value),
                  ns: "format",
                });
              }

              if (!value) {
                return "";
              }
              return value;
            },
          })
        );
      });
    };

    pushToColumns(agreementExchangeColumns);

    return columns;
  }, [t]);

  return (
    <div className="max-w-full focus:ring-0">
      {dataList.status === "loading" || dataList.data?.status !== 200 ? (
        <CommonEmptyStateContent
          title="No exchanges"
          subtitle="You haven't made any vehicle exchanges for this rental agreement."
          icon={<FilesIcon className="mx-auto h-12 w-12 text-slate-400" />}
        />
      ) : (
        <CommonTable columns={colDefs} data={dataList.data?.body || []} />
      )}
    </div>
  );
};

export default AgreementExchangesTab;
