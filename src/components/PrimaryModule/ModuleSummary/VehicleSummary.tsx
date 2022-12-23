import { useTranslation } from "react-i18next";

import { type TVehicleSummarySchema } from "../../../utils/schemas/summary/vehicleSummary";
import { CurrencyDollarSolid } from "../../icons";
import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

export const VehicleSummary = ({
  vehicleId,
  summaryData,
  currency = "",
}: {
  vehicleId: string | number;
  summaryData: TVehicleSummarySchema;
  currency?: string;
}) => {
  const { t } = useTranslation();
  console.log("summary", summaryData);

  const lineItems: Omit<TSummaryLineItemProps, "id">[] = [
    {
      label: "Total revenue",
      amount: t("intlCurrency", { value: summaryData?.totalRevenue, currency }),
      biggerText: true,
      primaryTextHighlight: Boolean(summaryData?.totalRevenue),
    },
    {
      label: "Total expenses",
      amount: t("intlCurrency", { value: summaryData?.totalExpense, currency }),
      primaryTextHighlight: Boolean(summaryData?.totalExpense),
    },
    {
      label: "Total profits",
      amount: t("intlCurrency", { value: summaryData?.totalProfit, currency }),
      primaryTextHighlight: Boolean(summaryData?.totalProfit),
    },
    {
      label: "Balances owing",
      amount: t("intlCurrency", { value: summaryData?.balanceOwing, currency }),
      primaryTextHighlight: Boolean(summaryData?.balanceOwing),
    },
    {
      label: "Monthly payment",
      amount: t("intlCurrency", {
        value: summaryData?.monthlyPayment,
        currency,
      }),
      primaryTextHighlight: Boolean(summaryData?.monthlyPayment),
    },
    {
      label: "Lease payout",
      amount: t("intlCurrency", {
        value: summaryData?.leasePayoutAmount,
        currency,
      }),
      primaryTextHighlight: Boolean(summaryData?.leasePayoutAmount),
    },
    {
      label: "Final payment date",
      amount: summaryData.finalPaymentDate
        ? t("intlDate", {
            value: summaryData?.finalPaymentDate,
            currency,
          })
        : "No date",
      primaryTextHighlight: Boolean(summaryData?.finalPaymentDate),
    },
    {
      label: "Total reservations",
      primaryTextHighlight: Boolean(summaryData?.totalNoOfReservation),
      type: summaryData.totalNoOfReservation ? "link" : "text",
      amount: summaryData.totalNoOfReservation,
      linkProps: {
        to: "/reservations",
        search: () => ({
          filters: { VehicleId: `${vehicleId}` },
        }),
      },
    },

    {
      label: "Current reservation",
      primaryTextHighlight:
        summaryData.currentReservation !== "" &&
        summaryData.currentReservation !== "0",
      type:
        summaryData.currentReservation !== "" &&
        summaryData.currentReservation !== "0"
          ? "link"
          : "text",
      amount:
        summaryData.currentReservation !== "" &&
        summaryData.currentReservation !== "0"
          ? "View"
          : "None",
      linkProps: {
        to: "/reservations/$reservationId",
        params: { reservationId: `${summaryData.currentReservation}` },
      },
    },
    {
      label: "Future reservations",
      primaryTextHighlight: Boolean(summaryData?.futureNoOfReservation),
      type: summaryData.futureNoOfReservation ? "link" : "text",
      amount: summaryData.futureNoOfReservation,
      linkProps: {
        to: "/reservations",
        search: () => ({
          filters: {
            VehicleId: `${vehicleId}`,
            Statuses: [2, 7],
          },
        }),
      },
    },
    {
      label: "Total agreements",
      primaryTextHighlight: Boolean(summaryData?.totalNoOfAgreement),
      type: summaryData.totalNoOfAgreement ? "link" : "text",
      amount: summaryData.totalNoOfAgreement,
      linkProps: {
        to: "/agreements",
        search: () => ({
          filters: { VehicleId: `${vehicleId}` },
        }),
      },
    },
    {
      label: "Current agreement",
      primaryTextHighlight:
        summaryData.currentAgreement !== "" &&
        summaryData.currentAgreement !== "0",
      type:
        summaryData.currentAgreement !== "" &&
        summaryData.currentAgreement !== "0"
          ? "link"
          : "text",
      amount:
        summaryData.currentAgreement !== "" &&
        summaryData.currentAgreement !== "0"
          ? "View"
          : "None",
      linkProps: {
        to: "/agreements/$agreementId",
        params: { agreementId: `${summaryData.currentAgreement}` },
      },
    },
    {
      label: "Current net value",
      amount: t("intlCurrency", {
        value: summaryData?.currentNetValue,
        currency,
      }),
      primaryTextHighlight: Boolean(summaryData?.currentNetValue),
    },
    {
      label: "Monthly depreciation",
      amount: t("intlCurrency", {
        value: summaryData?.monthlyDepreciation,
        currency,
      }),
      primaryTextHighlight: Boolean(summaryData?.monthlyDepreciation),
    },
    {
      label: "Total depreciation",
      amount: t("intlCurrency", {
        value: summaryData?.totalAmountDepreciated,
        currency,
      }),
      primaryTextHighlight: Boolean(summaryData?.totalAmountDepreciated),
    },
    {
      label: "Pending payments",
      primaryTextHighlight: Boolean(summaryData?.pendingPayment),
      type: summaryData.pendingPayment ? "link" : "text",
      amount: summaryData.pendingPayment ? summaryData.pendingPayment : "None",
      linkProps: {
        to: "/agreements",
        search: () => ({
          filters: { VehicleId: `${vehicleId}`, Statuses: [5] },
        }),
      },
    },
    {
      label: "Last rental date",
      amount: summaryData.lastRentalDate
        ? t("intlDate", { value: summaryData?.lastRentalDate, currency })
        : "None",
      primaryTextHighlight: Boolean(summaryData?.lastRentalDate),
    },
  ];

  const defaultLineItemsList = lineItems.map((item, idx) => ({
    ...item,
    id: `customer-summary-${idx}`,
  }));

  return (
    <div className="grid divide-y divide-gray-200 rounded bg-white py-1 shadow-sm">
      <SummaryHeader
        title="Summary"
        icon={<CurrencyDollarSolid className="h-5 w-5 text-gray-700" />}
      />
      {defaultLineItemsList
        .filter((item) => item.shown === true || item.shown === undefined)
        .map((item) => (
          <SummaryLineItem key={item.id} data={item} />
        ))}
    </div>
  );
};
