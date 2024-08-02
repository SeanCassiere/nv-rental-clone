import * as React from "react";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";

import type { TRentalRatesSummarySchema } from "@/lib/schemas/summary";

import { isFalsy, SummaryHeader, SummaryLineItem } from "./common";

function makeChargeItemText(
  charge: TRentalRatesSummarySchema["miscCharges"][number],
  t: TFunction
) {
  const name = charge.name;
  const type = charge.calculationType.toLowerCase();
  const total = charge.total;

  let chargeText = "";

  if (charge.quantity) {
    chargeText += " ( ";
  }
  if (type !== "percentage") {
    chargeText += String(
      t("intlCurrency", { value: charge.value, ns: "format" })
    );
  } else {
    chargeText += `${charge.value}`;
  }
  if (charge.units) {
    chargeText += ` x ${charge.units}`;
  }
  if (type === "percentage") {
    chargeText += "% ";
  }

  if (charge.quantity) {
    chargeText += ` ) x ${charge.quantity}`;
  }

  return `${name}: ${chargeText} = ${t("intlCurrency", {
    value: total,
    ns: "format",
  })}`;
}

function makeTaxItemText(tax: TRentalRatesSummarySchema["taxes"][number]) {
  return `${tax.name} ( ${Number(tax.value).toFixed(2)}% )`;
}

export const RentalSummary = ({
  module,
  summaryData,
}: {
  module:
    | "reservations"
    | "agreements"
    | "add-edit-agreement"
    | "add-edit-reservation";
  summaryData?: TRentalRatesSummarySchema;
}) => {
  const { t } = useTranslation();

  const itemsList = React.useMemo(() => {
    let items: { component: React.ReactNode; shown?: boolean }[] = [];

    const taxableMischarges = (summaryData?.miscCharges || [])
      .sort((chg1, chg2) => chg1.id - chg2.id)
      .filter((charge) => charge.isTaxable);
    const nonTaxableMischarges = (summaryData?.miscCharges || [])
      .sort((chg1, chg2) => chg1.id - chg2.id)
      .filter((charge) => !charge.isTaxable);
    const taxes = summaryData?.taxes || [];

    items = [
      {
        component: (
          <SummaryLineItem
            label="Base rate"
            value={t("intlCurrency", {
              value: summaryData?.baseRate,
              ns: "format",
            })}
            valueColor={isFalsy(summaryData?.baseRate) ? "muted" : "default"}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Discount on base rate"
            value={t("intlCurrency", {
              value: summaryData?.promotionDiscount,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.promotionDiscount) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Final base rate"
            value={t("intlCurrency", {
              value: summaryData?.finalBaseRate,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.finalBaseRate) ? "muted" : "default"
            }
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total miscellaneous charges"
            value={t("intlCurrency", {
              value: summaryData?.totalMiscChargesTaxable,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.totalMiscChargesTaxable)
                ? "muted"
                : "default"
            }
            initialDropdownExpanded={
              module === "add-edit-agreement" ||
              module === "add-edit-reservation"
            }
          >
            {taxableMischarges.length ? (
              <div className="pt-2">
                {taxableMischarges.map((charge) => (
                  <span
                    key={`taxable-charge-${charge.id}`}
                    className="block break-all text-sm text-foreground/70"
                  >
                    {makeChargeItemText(charge, t)}
                  </span>
                ))}
              </div>
            ) : null}
          </SummaryLineItem>
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total miscellaneous charges (non-taxable)"
            value={t("intlCurrency", {
              value: summaryData?.totalMiscChargesNonTaxable,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.totalMiscChargesNonTaxable)
                ? "muted"
                : "default"
            }
            initialDropdownExpanded={
              module === "add-edit-agreement" ||
              module === "add-edit-reservation"
            }
          >
            {nonTaxableMischarges.length ? (
              <div className="pt-2">
                {nonTaxableMischarges.map((charge) => (
                  <span
                    key={`non-taxable-charge-${charge.id}`}
                    className="block break-all text-sm text-foreground/70"
                  >
                    {makeChargeItemText(charge, t)}
                  </span>
                ))}
              </div>
            ) : null}
          </SummaryLineItem>
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Extra mileage charges"
            value={t("intlCurrency", {
              value: summaryData?.extraMilesCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.extraMilesCharge) ? "muted" : "default"
            }
          />
        ),
        shown: summaryData?.isExtraMileageChargeTaxable || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Extra duration charges"
            value={t("intlCurrency", {
              value: summaryData?.extraDayCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.extraDayCharge) ? "muted" : "default"
            }
          />
        ),
        shown: summaryData?.isExtraDayChargeTaxable || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Fuel charges"
            value={t("intlCurrency", {
              value: summaryData?.extraFuelCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.extraFuelCharge) ? "muted" : "default"
            }
          />
        ),
        shown: summaryData?.isFuelChargeTaxable || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Pre-tax adjustments"
            value={t("intlCurrency", {
              value: summaryData?.preAdjustment,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.preAdjustment) ? "muted" : "default"
            }
          />
        ),
        shown: !!summaryData?.preAdjustment,
      },
      {
        component: (
          <SummaryLineItem
            label="Pre-discount on subtotal"
            value={t("intlCurrency", {
              value: summaryData?.preSubTotal,
              ns: "format",
            })}
            valueColor={isFalsy(summaryData?.preSubTotal) ? "muted" : "default"}
          />
        ),
        shown: !!summaryData?.promotionDiscountOnSubTotal,
      },
      {
        component: (
          <SummaryLineItem
            label="Discount on subtotal"
            value={t("intlCurrency", {
              value: summaryData?.promotionDiscountOnSubTotal,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.promotionDiscountOnSubTotal)
                ? "muted"
                : "default"
            }
          />
        ),
        shown: !!summaryData?.promotionDiscountOnSubTotal,
      },
      {
        component: (
          <SummaryLineItem
            label="Subtotal"
            value={t("intlCurrency", {
              value: summaryData?.subTotal,
              ns: "format",
            })}
            valueColor={isFalsy(summaryData?.subTotal) ? "muted" : "default"}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Total taxes"
            value={t("intlCurrency", {
              value: summaryData?.totalTax,
              ns: "format",
            })}
            valueColor={isFalsy(summaryData?.totalTax) ? "muted" : "default"}
          >
            {taxes.length ? (
              <div className="pt-2">
                {taxes.map((tax) => (
                  <span
                    key={`tax-charge-${tax.taxId}`}
                    className="block break-all text-sm text-foreground/70"
                  >
                    {makeTaxItemText(tax)}
                  </span>
                ))}
              </div>
            ) : null}
          </SummaryLineItem>
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Extra mileage charges"
            value={t("intlCurrency", {
              value: summaryData?.extraMilesCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.extraMilesCharge) ? "muted" : "default"
            }
          />
        ),
        shown: !summaryData?.isExtraMileageChargeTaxable || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Extra duration charges"
            value={t("intlCurrency", {
              value: summaryData?.extraDayCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.extraDayCharge) ? "muted" : "default"
            }
          />
        ),
        shown: !summaryData?.isExtraDayChargeTaxable || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Fuel charges"
            value={t("intlCurrency", {
              value: summaryData?.extraFuelCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.extraFuelCharge) ? "muted" : "default"
            }
          />
        ),
        shown: !summaryData?.isFuelChargeTaxable || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Additional charges"
            value={t("intlCurrency", {
              value: summaryData?.additionalCharge,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.additionalCharge) ? "muted" : "default"
            }
          />
        ),
        shown: !!summaryData?.additionalCharge || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Post-tax adjustments"
            value={t("intlCurrency", {
              value: summaryData?.postAdjustment,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.postAdjustment) ? "muted" : "default"
            }
          />
        ),
        shown: !!summaryData?.postAdjustment || false,
      },
      {
        component: (
          <SummaryLineItem
            label="Grand total"
            value={t("intlCurrency", {
              value: summaryData?.total,
              ns: "format",
            })}
            contentSize="lg"
            contentColor="primary"
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Amount paid"
            value={t("intlCurrency", {
              value: summaryData?.amountPaid,
              ns: "format",
            })}
            valueColor={isFalsy(summaryData?.amountPaid) ? "muted" : "default"}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Balance due"
            value={t("intlCurrency", {
              value: summaryData?.balanceDue,
              ns: "format",
            })}
            valueColor={!!summaryData?.balanceDue ? "negative" : "muted"}
          />
        ),
      },
      {
        component: (
          <SummaryLineItem
            label="Security deposit"
            value={t("intlCurrency", {
              value: summaryData?.securityDeposit,
              ns: "format",
            })}
            valueColor={
              isFalsy(summaryData?.securityDeposit) ? "muted" : "default"
            }
          />
        ),
      },
    ];

    return items;
  }, [t, module, summaryData]);

  const visibleLineItems = itemsList.filter(
    (item) => item.shown === true || item.shown === undefined
  );

  return (
    <Card>
      <SummaryHeader
        title="Summary of charges"
        icon={<icons.DollarSign className="h-6 w-6" />}
      />
      <CardContent className="px-0 py-0">
        <ul className="grid divide-y">
          {visibleLineItems.map(({ component }, idx) => (
            <li key={`${module}-summary-${idx}`}>{component}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
