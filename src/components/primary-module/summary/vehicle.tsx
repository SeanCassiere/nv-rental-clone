import * as React from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";

import type { TVehicleSummarySchema } from "@/lib/schemas/summary/vehicleSummary";

import { isFalsy, SummaryHeader, SummaryLineItem } from "./common";

export const VehicleSummary = ({
  summaryData,
  vehicleNo,
  vehicleId,
}: {
  summaryData: TVehicleSummarySchema | undefined;
  vehicleNo?: string;
  vehicleId: string;
}) => {
  const { t } = useTranslation();

  const itemsList = React.useMemo(() => {
    const items: { component: React.ReactNode }[] = [
      {
        component: (
          <SummaryLineItem
            label="Total revenue"
            value={t("intlCurrency", {
              value: summaryData?.totalRevenue,
              ns: "format",
            })}
            contentSize="lg"
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total expenses"
            value={t("intlCurrency", {
              value: summaryData?.totalExpense,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.totalExpense) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total profits"
            value={t("intlCurrency", {
              value: summaryData?.totalProfit,
              ns: "format",
            })}
            valueColor={isFalsy(summaryData?.totalProfit) ? "muted" : "default"}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Balance owing"
            value={t("intlCurrency", {
              value: summaryData?.balanceOwing,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.balanceOwing) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Monthly payment"
            value={t("intlCurrency", {
              value: summaryData?.monthlyPayment,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.monthlyPayment) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Lease payout"
            value={t("intlCurrency", {
              value: summaryData?.leasePayoutAmount,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.leasePayoutAmount) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Final payment date"
            value={
              summaryData?.finalPaymentDate
                ? t("intlDate", {
                    value: summaryData?.finalPaymentDate,
                    ns: "format",
                  })
                : "No date"
            }
            valueColor={
              isFalsy(summaryData?.finalPaymentDate) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total reservations"
            value={Number(summaryData?.totalNoOfReservation || 0).toString()}
            valueColor={
              isFalsy(summaryData?.totalNoOfReservation) ? "muted" : "default"
            }
            valueType={!!summaryData?.totalNoOfReservation ? "link" : "default"}
            linkOptions={{
              to: "/fleet/$vehicleId/",
              search: () => ({ tab: "reservations" }),
              params: { vehicleId },
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Current reservation"
            value={
              summaryData?.currentReservation !== "" &&
              summaryData?.currentReservation !== "0"
                ? "View"
                : "None"
            }
            valueColor={
              summaryData?.currentReservation !== "" &&
              summaryData?.currentReservation !== "0"
                ? "default"
                : "muted"
            }
            valueType={
              summaryData?.currentReservation !== "" &&
              summaryData?.currentReservation !== "0"
                ? "link"
                : "default"
            }
            linkOptions={{
              to: "/reservations/$reservationId/",
              params: { reservationId: `${summaryData?.currentReservation}` },
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Future reservations"
            value={Number(summaryData?.futureNoOfReservation || 0).toString()}
            valueColor={
              isFalsy(summaryData?.futureNoOfReservation) ? "muted" : "default"
            }
            valueType={
              !!summaryData?.futureNoOfReservation ? "link" : "default"
            }
            linkOptions={{
              to: "/reservations",
              search: () => ({
                filters: {
                  VehicleNo: vehicleNo ?? "",
                  Statuses: ["2", "7"],
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total agreements"
            value={Number(summaryData?.totalNoOfAgreement || 0).toString()}
            valueColor={
              isFalsy(summaryData?.totalNoOfAgreement) ? "muted" : "default"
            }
            valueType={!!summaryData?.totalNoOfAgreement ? "link" : "default"}
            linkOptions={{
              to: "/fleet/$vehicleId",
              search: () => ({
                tab: "agreements",
              }),
              params: { vehicleId },
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Current agreement"
            value={
              summaryData?.currentAgreement !== "" &&
              summaryData?.currentAgreement !== "0"
                ? "View"
                : "None"
            }
            valueColor={
              summaryData?.currentAgreement !== "" &&
              summaryData?.currentAgreement !== "0"
                ? "default"
                : "muted"
            }
            valueType={
              summaryData?.currentAgreement !== "" &&
              summaryData?.currentAgreement !== "0"
                ? "link"
                : "default"
            }
            linkOptions={{
              to: "/agreements/$agreementId/",
              params: { agreementId: `${summaryData?.currentAgreement}` },
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Current net value"
            value={t("intlCurrency", {
              value: summaryData?.currentNetValue,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.currentNetValue) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Monthly depreciation"
            value={t("intlCurrency", {
              value: summaryData?.monthlyDepreciation,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.monthlyDepreciation) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total depreciation"
            value={t("intlCurrency", {
              value: summaryData?.totalAmountDepreciated,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.totalAmountDepreciated) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Pending payments"
            value={t("intlCurrency", {
              value: summaryData?.pendingPayment,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.pendingPayment) ? "muted" : "default"
            }
            valueType={!!summaryData?.pendingPayment ? "link" : "default"}
            linkOptions={{
              to: "/agreements",
              search: () => ({
                filters: { VehicleNo: vehicleNo ?? "", Statuses: ["5"] },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Last rental date"
            value={
              summaryData?.lastRentalDate
                ? t("intlDate", {
                    value: summaryData?.lastRentalDate,
                    ns: "format",
                  })
                : "No date"
            }
            valueColor={
              isFalsy(summaryData?.lastRentalDate) ? "muted" : "default"
            }
          />
        ),
      },
    ];

    return items;
  }, [t, summaryData, vehicleId, vehicleNo]);

  return (
    <Card>
      <SummaryHeader
        title="Summary"
        icon={<icons.DollarSign className="h-6 w-6" />}
      />
      <CardContent className="px-0 py-0">
        <ul className="grid divide-y">
          {itemsList.map(({ component }, idx) => (
            <li key={`vehicle-summary-${idx}`}>{component}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
