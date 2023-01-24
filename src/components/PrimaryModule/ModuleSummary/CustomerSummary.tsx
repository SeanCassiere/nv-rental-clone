import { useTranslation } from "react-i18next";

import { type TCustomerSummarySchema } from "../../../utils/schemas/summary/customerSummary";
import { CurrencyDollarSolid } from "../../icons";
import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

export const CustomerSummary = ({
  summaryData,
  currency = "",
}: {
  summaryData: TCustomerSummarySchema;
  currency?: string;
}) => {
  const { t } = useTranslation();

  const lineItems: Omit<TSummaryLineItemProps, "id">[] = [
    {
      label: "Total revenue",
      amount: t("intlCurrency", { value: summaryData?.totalRevenue, currency }),
      biggerText: true,
      primaryTextHighlight: Boolean(summaryData?.totalRevenue),
    },
    {
      label: "Open reservations",
      amount: summaryData?.openedReservation || 0,
      primaryTextHighlight: Boolean(summaryData?.openedReservation),
      type: Boolean(summaryData?.openedReservation) ? "link" : "text",
      linkProps: {
        to: "/reservations",
        search: () => ({
          filters: {
            Statuses: ["2"],
            CustomerId: `${summaryData.customerId}`,
          },
        }),
      },
    },
    {
      label: "Confirmed reservations",
      amount: summaryData?.confirmedReservation || 0,
      primaryTextHighlight: Boolean(summaryData?.confirmedReservation),
      type: Boolean(summaryData?.confirmedReservation) ? "link" : "text",
      linkProps: {
        to: "/reservations",
        search: () => ({
          filters: {
            Statuses: ["3"],
            CustomerId: `${summaryData.customerId}`,
          },
        }),
      },
    },
    {
      label: "No-show reservations",
      amount: summaryData?.noShowReservation || 0,
      primaryTextHighlight: Boolean(summaryData?.noShowReservation),
      type: Boolean(summaryData?.noShowReservation) ? "link" : "text",
      linkProps: {
        to: "/reservations",
        search: () => ({
          filters: {
            Statuses: ["4"],
            CustomerId: `${summaryData.customerId}`,
          },
        }),
      },
    },
    {
      label: "Cancelled reservations",
      amount: summaryData?.cancelledReservation || 0,
      primaryTextHighlight: Boolean(summaryData?.cancelledReservation),
      type: Boolean(summaryData?.cancelledReservation) ? "link" : "text",
      linkProps: {
        to: "/reservations",
        search: () => ({
          filters: {
            Statuses: ["5"],
            CustomerId: `${summaryData.customerId}`,
          },
        }),
      },
    },
    {
      label: "Opened agreements",
      amount: summaryData?.openedAgreements || 0,
      primaryTextHighlight: Boolean(summaryData?.openedAgreements),
      type: Boolean(summaryData?.openedAgreements) ? "link" : "text",
      linkProps: {
        to: "/agreements",
        search: () => ({
          filters: {
            Statuses: ["2"],
            CustomerId: `${summaryData.customerId}`,
            IsSearchOverdues: false,
          },
        }),
      },
    },
    {
      label: "Closed agreements",
      amount: summaryData?.closedAgreements || 0,
      primaryTextHighlight: Boolean(summaryData?.closedAgreements),
      type: Boolean(summaryData?.closedAgreements) ? "link" : "text",
      linkProps: {
        to: "/agreements",
        search: () => ({
          filters: {
            Statuses: ["3"],
            CustomerId: `${summaryData.customerId}`,
            IsSearchOverdues: false,
          },
        }),
      },
    },
    {
      label: "Total traffic tickets",
      amount: summaryData?.totalTrafficTickets || 0,
      primaryTextHighlight: Boolean(summaryData?.totalTrafficTickets),
    },
    {
      label: "Pending payments",
      amount: summaryData?.pendingPayments || 0,
      primaryTextHighlight: Boolean(summaryData?.pendingPayments),
      type: Boolean(summaryData?.pendingPayments) ? "link" : "text",
      linkProps: {
        to: "/agreements",
        search: () => ({
          filters: {
            Statuses: ["5"],
            CustomerId: `${summaryData.customerId}`,
            IsSearchOverdues: false,
          },
        }),
      },
    },
    {
      label: "Pending deposits",
      amount: summaryData?.pendingDeposit || 0,
      primaryTextHighlight: Boolean(summaryData?.pendingDeposit),
      type: Boolean(summaryData?.pendingDeposit) ? "link" : "text",
      linkProps: {
        to: "/agreements",
        search: () => ({
          filters: {
            Statuses: ["7"],
            CustomerId: `${summaryData.customerId}`,
            IsSearchOverdues: false,
          },
        }),
      },
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
