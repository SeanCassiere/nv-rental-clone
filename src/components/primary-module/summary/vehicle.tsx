import { Fragment } from "react";
import { CircleDollarSignIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { viewAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";
import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";
import { viewFleetByIdRoute } from "@/routes/fleet/fleet-id-route";
import { viewReservationByIdRoute } from "@/routes/reservations/reservation-id-route";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";

import { type TVehicleSummarySchema } from "@/schemas/summary/vehicleSummary";

import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

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
      label: "Total expenses",
      amount: t("intlCurrency", {
        value: summaryData?.totalExpense,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.totalExpense),
    },

    {
      label: "Total profits",
      amount: t("intlCurrency", {
        value: summaryData?.totalProfit,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.totalProfit),
    },

    {
      label: "Balances owing",
      amount: t("intlCurrency", {
        value: summaryData?.balanceOwing,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.balanceOwing),
    },

    {
      label: "Monthly payment",
      amount: t("intlCurrency", {
        value: summaryData?.monthlyPayment,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.monthlyPayment),
    },

    {
      label: "Lease payout",
      amount: t("intlCurrency", {
        value: summaryData?.leasePayoutAmount,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.leasePayoutAmount),
    },

    {
      label: "Final payment date",
      amount: summaryData?.finalPaymentDate
        ? t("intlDate", {
            value: summaryData?.finalPaymentDate,
            ns: "format",
          })
        : "No date",
      primaryTextHighlight: Boolean(summaryData?.finalPaymentDate),
    },

    {
      label: "Total reservations",
      primaryTextHighlight: Boolean(summaryData?.totalNoOfReservation),
      type: summaryData?.totalNoOfReservation ? "link" : "text",
      amount: summaryData?.totalNoOfReservation || null,
      linkProps: {
        to: viewFleetByIdRoute.to,
        search: () => ({
          tab: "reservations",
        }),
        params: { vehicleId: vehicleId },
        preload: "intent",
      },
    },

    {
      label: "Current reservation",
      primaryTextHighlight:
        summaryData?.currentReservation !== "" &&
        summaryData?.currentReservation !== "0",
      type:
        summaryData?.currentReservation !== "" &&
        summaryData?.currentReservation !== "0"
          ? "link"
          : "text",
      amount:
        summaryData?.currentReservation !== "" &&
        summaryData?.currentReservation !== "0"
          ? "View"
          : "None",
      linkProps: {
        to: viewReservationByIdRoute.to,
        params: { reservationId: `${summaryData?.currentReservation}` },
        preload: "intent",
      },
    },

    {
      label: "Future reservations",
      primaryTextHighlight: Boolean(summaryData?.futureNoOfReservation),
      type: summaryData?.futureNoOfReservation ? "link" : "text",
      amount: summaryData?.futureNoOfReservation || null,
      linkProps: {
        to: searchReservationsRoute.to,
        search: () => ({
          filters: {
            VehicleNo: vehicleNo ?? "",
            Statuses: ["2", "7"],
          },
        }),
        preload: "intent",
      },
    },

    {
      label: "Total agreements",
      primaryTextHighlight: Boolean(summaryData?.totalNoOfAgreement),
      type: summaryData?.totalNoOfAgreement ? "link" : "text",
      amount: summaryData?.totalNoOfAgreement || null,
      linkProps: {
        to: viewFleetByIdRoute.to,
        search: () => ({
          tab: "agreements",
        }),
        params: { vehicleId: vehicleId },
        preload: "intent",
      },
    },

    {
      label: "Current agreement",
      primaryTextHighlight:
        summaryData?.currentAgreement !== "" &&
        summaryData?.currentAgreement !== "0",
      type:
        summaryData?.currentAgreement !== "" &&
        summaryData?.currentAgreement !== "0"
          ? "link"
          : "text",
      amount:
        summaryData?.currentAgreement !== "" &&
        summaryData?.currentAgreement !== "0"
          ? "View"
          : "None",
      linkProps: {
        to: viewAgreementByIdRoute.to,
        params: { agreementId: `${summaryData?.currentAgreement}` },
        preload: "intent",
      },
    },

    {
      label: "Current net value",
      amount: t("intlCurrency", {
        value: summaryData?.currentNetValue,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.currentNetValue),
    },

    {
      label: "Monthly depreciation",
      amount: t("intlCurrency", {
        value: summaryData?.monthlyDepreciation,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.monthlyDepreciation),
    },

    {
      label: "Total depreciation",
      amount: t("intlCurrency", {
        value: summaryData?.totalAmountDepreciated,
        ns: "format",
      }),
      primaryTextHighlight: Boolean(summaryData?.totalAmountDepreciated),
    },

    {
      label: "Pending payments",
      primaryTextHighlight: Boolean(summaryData?.pendingPayment),
      type: summaryData?.pendingPayment ? "link" : "text",
      amount: summaryData?.pendingPayment
        ? summaryData?.pendingPayment
        : "None",
      linkProps: {
        to: searchAgreementsRoute.to,
        search: () => ({
          filters: { VehicleNo: vehicleNo ?? "", Statuses: ["5"] },
        }),
        preload: "intent",
      },
    },

    {
      label: "Last rental date",
      amount: summaryData?.lastRentalDate
        ? t("intlDate", {
            value: summaryData?.lastRentalDate,
            ns: "format",
          })
        : "None",
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
        icon={<CircleDollarSignIcon className="h-6 w-6" />}
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
