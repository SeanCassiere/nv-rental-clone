import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import CommonTable from "../General/CommonTable";
import { type TVehicleExchangeListItemParsed } from "../../utils/schemas/vehicleExchange";
import { useGetVehicleExchanges } from "../../hooks/network/vehicle-exchange/useGetVehicleExchanges";
import { parseISO } from "date-fns";
import { viewVehicleRoute } from "../../routes/vehicles/viewVehicle";

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
                    to={viewVehicleRoute.id}
                    params={{ vehicleId: `${vehicleId}` }}
                    search={() => ({ tab: "summary" })}
                    className="font-medium text-slate-800"
                    preload="intent"
                  >
                    {String(value)}
                  </Link>
                );
              }

              if (column.type === "date-time" && typeof value === "string") {
                return t("intlDateTime", { value: parseISO(value) });
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
      <CommonTable columns={colDefs} data={dataList.data || []} />
    </div>
  );
};

export default AgreementExchangesTab;
