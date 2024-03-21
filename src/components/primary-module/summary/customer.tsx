import * as React from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";

import type { TCustomerSummarySchema } from "@/lib/schemas/summary/customerSummary";

import { isFalsy, SummaryHeader, SummaryLineItem } from "./common";

export const CustomerSummary = ({
  summaryData,
}: {
  summaryData: TCustomerSummarySchema | undefined;
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
            label="Open reservations"
            value={summaryData?.openedReservation || 0}
            valueType={!!summaryData?.openedReservation ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.openedReservation) ? "muted" : "default"
            }
            linkOptions={{
              to: "/reservations",
              search: () => ({
                filters: {
                  Statuses: ["2"],
                  CustomerId: `${summaryData?.customerId}`,
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Confirmed reservations"
            value={summaryData?.confirmedReservation || 0}
            valueType={!!summaryData?.confirmedReservation ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.confirmedReservation) ? "muted" : "default"
            }
            linkOptions={{
              to: "/reservations",
              search: () => ({
                filters: {
                  Statuses: ["3"],
                  CustomerId: `${summaryData?.customerId}`,
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="No-show reservations"
            value={summaryData?.noShowReservation || 0}
            valueType={!!summaryData?.noShowReservation ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.noShowReservation) ? "muted" : "default"
            }
            linkOptions={{
              to: "/reservations",
              search: () => ({
                filters: {
                  Statuses: ["4"],
                  CustomerId: `${summaryData?.customerId}`,
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Cancelled reservations"
            value={summaryData?.cancelledReservation || 0}
            valueType={!!summaryData?.cancelledReservation ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.cancelledReservation) ? "muted" : "default"
            }
            linkOptions={{
              to: "/reservations",
              search: () => ({
                filters: {
                  Statuses: ["5"],
                  CustomerId: `${summaryData?.customerId}`,
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Open agreements"
            value={summaryData?.openedAgreements || 0}
            valueType={!!summaryData?.openedAgreements ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.openedAgreements) ? "muted" : "default"
            }
            linkOptions={{
              to: "/agreements",
              search: () => ({
                filters: {
                  Statuses: ["2"],
                  CustomerId: `${summaryData?.customerId}`,
                  IsSearchOverdues: "false",
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Closed agreements"
            value={summaryData?.closedAgreements || 0}
            valueType={!!summaryData?.closedAgreements ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.closedAgreements) ? "muted" : "default"
            }
            linkOptions={{
              to: "/agreements",
              search: () => ({
                filters: {
                  Statuses: ["3"],
                  CustomerId: `${summaryData?.customerId}`,
                  IsSearchOverdues: "false",
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total traffic tickets"
            value={summaryData?.totalTrafficTickets || 0}
            valueColor={
              isFalsy(summaryData?.totalTrafficTickets) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Pending payments"
            value={summaryData?.pendingPayments || 0}
            valueType={!!summaryData?.pendingPayments ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.pendingPayments) ? "muted" : "default"
            }
            linkOptions={{
              to: "/agreements",
              search: () => ({
                filters: {
                  Statuses: ["5"],
                  CustomerId: `${summaryData?.customerId}`,
                  IsSearchOverdues: "false",
                },
              }),
            }}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Pending deposits"
            value={summaryData?.pendingDeposit || 0}
            valueType={!!summaryData?.pendingDeposit ? "link" : "default"}
            valueColor={
              isFalsy(summaryData?.pendingDeposit) ? "muted" : "default"
            }
            linkOptions={{
              to: "/agreements",
              search: () => ({
                filters: {
                  Statuses: ["7"],
                  CustomerId: `${summaryData?.customerId}`,
                  IsSearchOverdues: "false",
                },
              }),
            }}
          />
        ),
      },
    ];

    return items;
  }, [t, summaryData]);

  return (
    <Card>
      <SummaryHeader
        title="Summary"
        icon={<icons.DollarSign className="h-6 w-6" />}
      />
      <CardContent className="px-0 py-0">
        <ul className="grid divide-y">
          {itemsList.map(({ component }, idx) => (
            <li key={`customer-summary-${idx}`}>{component}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
