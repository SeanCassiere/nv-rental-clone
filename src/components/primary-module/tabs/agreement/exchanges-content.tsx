import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { FilesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CommonTable } from "@/components/common/common-table";
import { EmptyState } from "@/components/layouts/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetVehicleExchanges } from "@/hooks/network/vehicle-exchange/useGetVehicleExchanges";

import { type TVehicleExchangeListItemParsed } from "@/schemas/vehicleExchange";

import { cn } from "@/utils";

const columnHelper = createColumnHelper<TVehicleExchangeListItemParsed>();
type TVehicleExchangeKeyHelp = {
  type: "text" | "date-time" | "link-old-vehicle";
  accessor: keyof TVehicleExchangeListItemParsed;
  header: string;
};

const AgreementExchangesTab = ({ referenceId }: { referenceId: string }) => {
  const { t } = useTranslation();

  const dataList = useGetVehicleExchanges({ agreementId: referenceId });

  const agreementExchangeColumns = useMemo(() => {
    const cols: TVehicleExchangeKeyHelp[] = [
      {
        type: "link-old-vehicle",
        accessor: "orgVehicleViewName",
        header: "Incoming vehicle",
      },
      { type: "text", accessor: "orgVehicleStatus", header: "Incoming status" },
      {
        type: "text",
        accessor: "orgVehicleOdometerIn",
        header: "Odometer in",
      },
      {
        type: "text",
        accessor: "orgVehicleFuelLevelIn",
        header: "Fuel status in",
      },
      {
        type: "text",
        accessor: "newVehicleViewName",
        header: "Outgoing vehicle",
      },
      {
        type: "text",
        accessor: "newVehicleOdometerOut",
        header: "Odometer out",
      },
      {
        type: "text",
        accessor: "newVehicleFuelLevelOut",
        header: "Fuel status out",
      },
      { type: "date-time", accessor: "exchangeDate", header: "Exchange date" },
      { type: "text", accessor: "createdByName", header: "Created by" },
    ];
    return cols;
  }, []);

  const colDefs = useMemo(() => {
    const columns: ColumnDef<TVehicleExchangeListItemParsed>[] = [];

    const pushToColumns = (localColumns: TVehicleExchangeKeyHelp[]) => {
      localColumns.forEach((column) => {
        columns.push(
          columnHelper.accessor(column.accessor as any, {
            id: column.header,
            header: () => column.header,
            cell: (item) => {
              let value = item.getValue();

              if (column.accessor === "orgVehicleViewName") {
                const row = item.table.getRow(item.row.id).original;
                const year = row.orgVehicleYear;
                const make = row.orgVehicleMake;
                const model = row.orgVehicleModel;
                const license = row.orgVehicleLicenseNo;
                const vehicleNo = row.orgVehicleNo;
                value = `${
                  vehicleNo !== license ? `${vehicleNo}-` : ""
                }${year}-${make}-${model}-${license}`.trim();
              }

              if (column.accessor === "newVehicleViewName") {
                const row = item.table.getRow(item.row.id).original;
                const year = row.newVehicleYear;
                const make = row.newVehicleMake;
                const model = row.newVehicleModel;
                const license = row.newVehicleLicenseNo;
                const vehicleNo = row.newVehicleNo;
                value = `${
                  vehicleNo !== license ? `${vehicleNo}-` : ""
                }${year}-${make}-${model}-${license}`.trim();
              }

              if (column.accessor === "orgVehicleStatus") {
                return <Badge variant="outline">{String(value)}</Badge>;
              }

              if (column.type === "link-old-vehicle") {
                const vehicleId = item.table.getRow(item.row.id).original
                  .orgVehicleId;

                return (
                  <Link
                    to="/fleet/$vehicleId"
                    params={{ vehicleId: `${vehicleId}` }}
                    search={() => ({ tab: "summary" })}
                    className={cn(buttonVariants({ variant: "link" }), "px-0")}
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
  }, [agreementExchangeColumns, t]);

  const list = dataList.data?.status === 200 ? dataList.data?.body : [];

  return (
    <div className="max-w-full focus:ring-0">
      {dataList.status === "pending" ? (
        <Skeleton className="h-[450px]" />
      ) : (
        <>
          {dataList.status === "error" ||
          dataList.data?.status !== 200 ||
          dataList?.data.body?.length === 0 ? (
            <EmptyState
              title="No exchanges"
              subtitle="You haven't made any fleet exchanges for this rental agreement."
              icon={FilesIcon}
            />
          ) : (
            <CommonTable columns={colDefs} data={list} />
          )}
        </>
      )}
    </div>
  );
};

export default AgreementExchangesTab;
