import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { CommonTable } from "@/components/common/common-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";

import type { TAgreementListItemParsed } from "@/lib/schemas/agreement";

import { Container } from "@/routes/-components/container";

import {
  AgreementDateTimeColumns,
  sortColumnsByOrderIndex,
} from "@/lib/utils/columns";

export const Route = createLazyFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/agreements"
)({
  component: Component,
});

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

function Component() {
  const { vehicleNo, agreementColumnsOptions, agreementListOptions } =
    Route.useRouteContext();

  const { t } = useTranslation();

  const agreementsQuery = useSuspenseQuery(agreementListOptions);
  const columnsQuery = useSuspenseQuery(agreementColumnsOptions);

  const columnDefs = React.useMemo(() => {
    const columns: ColumnDef<TAgreementListItemParsed>[] = [];

    (columnsQuery.data.status === 200 ? columnsQuery.data.body : [])
      .sort(sortColumnsByOrderIndex)
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
                    to="/agreements/$agreementId/summary"
                    params={{ agreementId: String(agreementId) }}
                    className="font-semibold"
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
  }, [columnsQuery.data, t]);

  const agreementsList =
    agreementsQuery.data?.status === 200 ? agreementsQuery.data?.body : [];

  return (
    <Container as="div">
      <div className="mb-6 max-w-full px-2 sm:px-4">
        {agreementsQuery.status === "success" && (
          <CommonTable data={agreementsList} columns={columnDefs} />
        )}

        {agreementsQuery.status === "success" && agreementsList.length > 0 && (
          <div className="py-4">
            <p className="text-muted-foreground">
              Showing a maximum of {pageSize} records.
            </p>
            <Link
              to="/agreements"
              search={(prev) => ({
                ...prev,
                filters: { VehicleNo: vehicleNo },
              })}
              className="text-muted-foreground underline"
            >
              Need more? Click here to search for agreements.
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
