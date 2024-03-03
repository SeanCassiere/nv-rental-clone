import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";

import type { TCustomerSummarySchema } from "@/lib/schemas/summary/customerSummary";

import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

export const CustomerSummary = ({
  summaryData,
}: {
  summaryData: TCustomerSummarySchema | undefined;
}) => {
  const { t } = useTranslation();

  const lineItems: Omit<TSummaryLineItemProps, "id">[] = [
    {
      label: "Total revenue",
      amount: t("intlCurrency", {
        value: summaryData?.totalRevenue,
        ns: "format",
      }),
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
            CustomerId: `${summaryData?.customerId}`,
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
            CustomerId: `${summaryData?.customerId}`,
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
            CustomerId: `${summaryData?.customerId}`,
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
            CustomerId: `${summaryData?.customerId}`,
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
            CustomerId: `${summaryData?.customerId}`,
            IsSearchOverdues: "false",
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
            CustomerId: `${summaryData?.customerId}`,
            IsSearchOverdues: "false",
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
            CustomerId: `${summaryData?.customerId}`,
            IsSearchOverdues: "false",
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
            CustomerId: `${summaryData?.customerId}`,
            IsSearchOverdues: "false",
          },
        }),
      },
    },
  ];

  const defaultLineItemsList = lineItems.map((item, idx) => ({
    ...item,
    id: `customer-summary-${idx}`,
  }));

  const viewableLineItems = defaultLineItemsList.filter(
    (item) => item.shown === true || item.shown === undefined
  );

  return (
    <Card>
      <SummaryHeader
        title="Summary"
        icon={<icons.DollarSign className="h-6 w-6" />}
      />
      <CardContent className="px-0 py-0">
        <ul className="flex flex-col">
          {viewableLineItems.map((item, idx) => (
            <Fragment key={item.id}>
              <li>
                <SummaryLineItem data={item} />
                {viewableLineItems.length !== idx + 1 && <Separator />}
              </li>
            </Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
