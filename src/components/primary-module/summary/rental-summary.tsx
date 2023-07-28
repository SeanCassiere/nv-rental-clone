import { useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { CircleDollarSignIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type TRentalRatesSummarySchema } from "@/schemas/summary";
import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

function makeChargeItemText(
  charge: TRentalRatesSummarySchema["miscCharges"][number],
  t: TFunction,
  currency?: string
) {
  const name = charge.name;
  const type = charge.calculationType.toLowerCase();
  const total = charge.total;

  let chargeText = "";

  if (charge.quantity) {
    chargeText += " ( ";
  }
  if (type !== "percentage") {
    chargeText += String(t("intlCurrency", { value: charge.value, currency }));
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
    currency,
  })}`;
}

function makeTaxItemText(tax: TRentalRatesSummarySchema["taxes"][number]) {
  return `${tax.name} ( ${Number(tax.value).toFixed(2)}% )`;
}

export const RentalSummary = ({
  module,
  summaryData,
  currency = "",
}: {
  module:
    | "reservations"
    | "agreements"
    | "add-edit-agreement"
    | "add-edit-reservation";
  summaryData?: TRentalRatesSummarySchema;
  currency?: string;
}) => {
  const { t } = useTranslation();

  const defaultLineItemsList = useMemo(() => {
    let lineItems: Omit<TSummaryLineItemProps, "id">[] = [];

    const taxableMischarges = (summaryData?.miscCharges || [])
      .sort((chg1, chg2) => chg1.id - chg2.id)
      .filter((charge) => charge.isTaxable);
    const nonTaxableMischarges = (summaryData?.miscCharges || [])
      .sort((chg1, chg2) => chg1.id - chg2.id)
      .filter((charge) => !charge.isTaxable);
    const taxes = summaryData?.taxes || [];

    if (module === "agreements" || module === "reservations") {
      lineItems = [
        {
          label: "Base rate",
          amount: t("intlCurrency", {
            value: summaryData?.baseRate,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.baseRate),
        },
        {
          label: "Discount on base rate",
          amount: t("intlCurrency", {
            value: summaryData?.promotionDiscount,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.promotionDiscount),
        },
        {
          label: "Final base rate",
          amount: t("intlCurrency", {
            value: summaryData?.finalBaseRate,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.finalBaseRate),
        },
        {
          label: "Total miscellaneous charges",
          amount: t("intlCurrency", {
            value: summaryData?.totalMiscChargesTaxable,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.totalMiscChargesTaxable),
          hasDropdownContent: Boolean(taxableMischarges.length > 0),
          dropdownContent: taxableMischarges.map((charge) => (
            <span
              key={`taxable-charge-${charge.id}`}
              className="block break-all text-sm text-primary/70"
            >
              {makeChargeItemText(charge, t, currency)}
            </span>
          )),
        },
        {
          label: "Total miscellaneous charges (non-taxable)",
          amount: t("intlCurrency", {
            value: summaryData?.totalMiscChargesNonTaxable,
            currency,
          }),
          primaryTextHighlight: Boolean(
            summaryData?.totalMiscChargesNonTaxable
          ),
          hasDropdownContent: Boolean(nonTaxableMischarges.length > 0),
          dropdownContent: nonTaxableMischarges.map((charge) => (
            <span
              key={`non-taxable-charge-${charge.id}`}
              className="block break-all text-sm text-primary/70"
            >
              {makeChargeItemText(charge, t, currency)}
            </span>
          )),
        },
        {
          label: "Extra mileage charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraMilesCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraMilesCharge),
          shown: summaryData?.isExtraMileageChargeTaxable || false,
        },
        {
          label: "Extra duration charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraDayCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraDayCharge),
          shown: summaryData?.isExtraDayChargeTaxable || false,
        },
        {
          label: "Fuel charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraFuelCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraFuelCharge),
          shown: summaryData?.isFuelChargeTaxable || false,
        },
        {
          label: "Pre-tax adjustments",
          amount: t("intlCurrency", {
            value: summaryData?.preAdjustment,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.preAdjustment),
          shown: Boolean(summaryData?.preAdjustment),
        },
        {
          label: "Pre-discount on subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.preSubTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.preSubTotal),
          shown: Boolean(summaryData?.promotionDiscountOnSubTotal),
        },
        {
          label: "Discount on subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.promotionDiscountOnSubTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(
            summaryData?.promotionDiscountOnSubTotal
          ),
          shown: Boolean(summaryData?.promotionDiscountOnSubTotal),
        },
        {
          label: "Subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.subTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.subTotal),
        },
        {
          label: "Total taxes",
          amount: t("intlCurrency", {
            value: summaryData?.totalTax,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.totalTax),
          hasDropdownContent: Boolean(taxes.length > 0),
          dropdownContent: taxes.map((tax) => (
            <span
              key={`tax-charge-${tax.taxId}`}
              className="block break-all text-sm text-primary/70"
            >
              {makeTaxItemText(tax)}
            </span>
          )),
        },
        {
          label: "Extra mileage charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraMilesCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraMilesCharge),
          shown: !summaryData?.isExtraMileageChargeTaxable || false,
        },
        {
          label: "Extra duration charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraDayCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraDayCharge),
          shown: !summaryData?.isExtraDayChargeTaxable || false,
        },
        {
          label: "Fuel charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraFuelCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraFuelCharge),
          shown: !summaryData?.isFuelChargeTaxable || false,
        },
        {
          label: "Additional charges",
          amount: t("intlCurrency", {
            value: summaryData?.additionalCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.additionalCharge),
          shown: Boolean(summaryData?.additionalCharge),
        },
        {
          label: "Post-tax adjustments",
          amount: t("intlCurrency", {
            value: summaryData?.postAdjustment,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.postAdjustment),
          shown: Boolean(summaryData?.postAdjustment),
        },
        {
          label: "Grand total",
          amount: t("intlCurrency", { value: summaryData?.total, currency }),
          primaryBlockHighlight: true,
          biggerText: true,
        },
        {
          label: "Amount paid",
          amount: t("intlCurrency", {
            value: summaryData?.amountPaid,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.amountPaid),
        },
        {
          label: "Balance due",
          amount: t("intlCurrency", {
            value: summaryData?.balanceDue,
            currency,
          }),
          redHighlight: Boolean(summaryData?.balanceDue),
        },
        {
          label: "Security deposit",
          amount: t("intlCurrency", {
            value: summaryData?.securityDeposit,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.securityDeposit),
        },
      ];
    }

    if (module === "add-edit-agreement") {
      lineItems = [
        {
          label: "Base rate",
          amount: t("intlCurrency", {
            value: summaryData?.baseRate,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.baseRate),
        },
        {
          label: "Discount on base rate",
          amount: t("intlCurrency", {
            value: summaryData?.promotionDiscount,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.promotionDiscount),
        },
        {
          label: "Final base rate",
          amount: t("intlCurrency", {
            value: summaryData?.finalBaseRate,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.finalBaseRate),
        },
        {
          label: "Total miscellaneous charges",
          amount: t("intlCurrency", {
            value: summaryData?.totalMiscChargesTaxable,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.totalMiscChargesTaxable),
          hasDropdownContent: Boolean(taxableMischarges.length > 0),
          dropdownContent: taxableMischarges.map((charge) => (
            <span
              key={`taxable-charge-${charge.id}`}
              className="block break-all text-sm text-primary/70"
            >
              {makeChargeItemText(charge, t, currency)}
            </span>
          )),
          isDropdownContentInitiallyShown: true,
        },
        {
          label: "Total miscellaneous charges (non-taxable)",
          amount: t("intlCurrency", {
            value: summaryData?.totalMiscChargesNonTaxable,
            currency,
          }),
          primaryTextHighlight: Boolean(
            summaryData?.totalMiscChargesNonTaxable
          ),
          hasDropdownContent: Boolean(nonTaxableMischarges.length > 0),
          dropdownContent: nonTaxableMischarges.map((charge) => (
            <span
              key={`non-taxable-charge-${charge.id}`}
              className="block break-all text-sm text-primary/70"
            >
              {makeChargeItemText(charge, t, currency)}
            </span>
          )),
          isDropdownContentInitiallyShown: true,
        },
        {
          label: "Extra mileage charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraMilesCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraMilesCharge),
          shown: summaryData?.isExtraMileageChargeTaxable || false,
        },
        {
          label: "Extra duration charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraDayCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraDayCharge),
          shown: summaryData?.isExtraDayChargeTaxable || false,
        },
        {
          label: "Fuel charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraFuelCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraFuelCharge),
          shown: summaryData?.isFuelChargeTaxable || false,
        },
        {
          label: "Pre-tax adjustments",
          amount: t("intlCurrency", {
            value: summaryData?.preAdjustment,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.preAdjustment),
          shown: Boolean(summaryData?.preAdjustment),
        },
        {
          label: "Pre-discount on subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.preSubTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.preSubTotal),
          shown: Boolean(summaryData?.promotionDiscountOnSubTotal),
        },
        {
          label: "Discount on subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.promotionDiscountOnSubTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(
            summaryData?.promotionDiscountOnSubTotal
          ),
          shown: Boolean(summaryData?.promotionDiscountOnSubTotal),
        },
        {
          label: "Subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.subTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.subTotal),
        },
        {
          label: "Total taxes",
          amount: t("intlCurrency", {
            value: summaryData?.totalTax,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.totalTax),
          hasDropdownContent: Boolean(taxes.length > 0),
          dropdownContent: taxes.map((tax) => (
            <span
              key={`tax-charge-${tax.taxId}`}
              className="block break-all text-sm text-primary/70"
            >
              {makeTaxItemText(tax)}
            </span>
          )),
          isDropdownContentInitiallyShown: true,
        },
        {
          label: "Extra mileage charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraMilesCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraMilesCharge),
          shown: !summaryData?.isExtraMileageChargeTaxable || false,
        },
        {
          label: "Extra duration charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraDayCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraDayCharge),
          shown: !summaryData?.isExtraDayChargeTaxable || false,
        },
        {
          label: "Fuel charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraFuelCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraFuelCharge),
          shown: !summaryData?.isFuelChargeTaxable || false,
        },
        {
          label: "Additional charges",
          amount: t("intlCurrency", {
            value: summaryData?.additionalCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.additionalCharge),
          shown: Boolean(summaryData?.additionalCharge),
        },
        {
          label: "Post-tax adjustments",
          amount: t("intlCurrency", {
            value: summaryData?.postAdjustment,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.postAdjustment),
          shown: Boolean(summaryData?.postAdjustment),
        },
        {
          label: "Grand total",
          amount: t("intlCurrency", { value: summaryData?.total, currency }),
          primaryBlockHighlight: true,
          biggerText: true,
        },
        {
          label: "Amount paid",
          amount: t("intlCurrency", {
            value: summaryData?.amountPaid,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.amountPaid),
        },
        {
          label: "Balance due",
          amount: t("intlCurrency", {
            value: summaryData?.balanceDue,
            currency,
          }),
          redHighlight: Boolean(summaryData?.balanceDue),
        },
        {
          label: "Security deposit",
          amount: t("intlCurrency", {
            value: summaryData?.securityDeposit,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.securityDeposit),
        },
      ];
    }

    if (module === "add-edit-reservation") {
      lineItems = [
        {
          label: "Base rate",
          amount: t("intlCurrency", {
            value: summaryData?.baseRate,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.baseRate),
        },
        {
          label: "Discount on base rate",
          amount: t("intlCurrency", {
            value: summaryData?.promotionDiscount,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.promotionDiscount),
        },
        {
          label: "Final base rate",
          amount: t("intlCurrency", {
            value: summaryData?.finalBaseRate,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.finalBaseRate),
        },
        {
          label: "Total miscellaneous charges",
          amount: t("intlCurrency", {
            value: summaryData?.totalMiscChargesTaxable,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.totalMiscChargesTaxable),
          dropdownContent: <></>,
        },
        {
          label: "Total miscellaneous charges (non-taxable)",
          amount: t("intlCurrency", {
            value: summaryData?.totalMiscChargesNonTaxable,
            currency,
          }),
          primaryTextHighlight: Boolean(
            summaryData?.totalMiscChargesNonTaxable
          ),
        },
        {
          label: "Extra mileage charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraMilesCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraMilesCharge),
          shown: summaryData?.isExtraMileageChargeTaxable || false,
        },
        {
          label: "Extra duration charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraDayCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraDayCharge),
          shown: summaryData?.isExtraDayChargeTaxable || false,
        },
        {
          label: "Fuel charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraFuelCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraFuelCharge),
          shown: summaryData?.isFuelChargeTaxable || false,
        },
        {
          label: "Pre-tax adjustments",
          amount: t("intlCurrency", {
            value: summaryData?.preAdjustment,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.preAdjustment),
          shown: Boolean(summaryData?.preAdjustment),
        },
        {
          label: "Pre-discount on subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.preSubTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.preSubTotal),
          shown: Boolean(summaryData?.promotionDiscountOnSubTotal),
        },
        {
          label: "Discount on subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.promotionDiscountOnSubTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(
            summaryData?.promotionDiscountOnSubTotal
          ),
          shown: Boolean(summaryData?.promotionDiscountOnSubTotal),
        },
        {
          label: "Subtotal",
          amount: t("intlCurrency", {
            value: summaryData?.subTotal,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.subTotal),
        },
        {
          label: "Total taxes",
          amount: t("intlCurrency", {
            value: summaryData?.totalTax,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.totalTax),
        },
        {
          label: "Extra mileage charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraMilesCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraMilesCharge),
          shown: !summaryData?.isExtraMileageChargeTaxable || false,
        },
        {
          label: "Extra duration charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraDayCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraDayCharge),
          shown: !summaryData?.isExtraDayChargeTaxable || false,
        },
        {
          label: "Fuel charges",
          amount: t("intlCurrency", {
            value: summaryData?.extraFuelCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.extraFuelCharge),
          shown: !summaryData?.isFuelChargeTaxable || false,
        },
        {
          label: "Additional charges",
          amount: t("intlCurrency", {
            value: summaryData?.additionalCharge,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.additionalCharge),
          shown: Boolean(summaryData?.additionalCharge),
        },
        {
          label: "Post-tax adjustments",
          amount: t("intlCurrency", {
            value: summaryData?.postAdjustment,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.postAdjustment),
          shown: Boolean(summaryData?.postAdjustment),
        },
        {
          label: "Grand total",
          amount: t("intlCurrency", { value: summaryData?.total, currency }),
          primaryBlockHighlight: true,
          biggerText: true,
        },
        {
          label: "Amount paid",
          amount: t("intlCurrency", {
            value: summaryData?.amountPaid,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.amountPaid),
        },
        {
          label: "Balance due",
          amount: t("intlCurrency", {
            value: summaryData?.balanceDue,
            currency,
          }),
          redHighlight: Boolean(summaryData?.balanceDue),
        },
        {
          label: "Security deposit",
          amount: t("intlCurrency", {
            value: summaryData?.securityDeposit,
            currency,
          }),
          primaryTextHighlight: Boolean(summaryData?.securityDeposit),
        },
      ];
    }

    return lineItems;
  }, [t, module, summaryData, currency]);

  const lineItems = defaultLineItemsList.map((item, idx) => ({
    ...item,
    id: `${module}-summary-${idx}`,
  }));

  const viewableLineItems = lineItems.filter(
    (item) => item.shown === true || item.shown === undefined
  );

  return (
    <Card>
      <SummaryHeader
        title="Summary of charges"
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
