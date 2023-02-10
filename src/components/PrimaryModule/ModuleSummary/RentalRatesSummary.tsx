import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type TRentalRatesSummarySchema } from "../../../utils/schemas/summary";
import { CurrencyDollarSolid } from "../../icons";
import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

export const RentalRatesSummary = ({
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

  return (
    <div className="grid divide-y divide-gray-200 rounded border border-slate-200 bg-slate-50 pb-1 shadow-sm">
      <SummaryHeader
        title="Summary of charges"
        icon={<CurrencyDollarSolid className="h-5 w-5 text-gray-700" />}
      />
      {lineItems
        .filter((item) => item.shown === true || item.shown === undefined)
        .map((item) => (
          <SummaryLineItem key={item.id} data={item} />
        ))}
    </div>
  );
};
