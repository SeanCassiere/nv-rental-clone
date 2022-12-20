import { type TRentalRatesSummarySchema } from "../../../utils/schemas/summary";
import { CurrencyDollarSolid } from "../../icons";
import {
  SummaryHeader,
  SummaryLineItem,
  type TSummaryLineItemProps,
} from "./common";

const RentalRatesSummary = ({
  module,
  summaryData,
}: {
  module: "reservations" | "agreements";
  summaryData: TRentalRatesSummarySchema;
}) => {
  const defaultLineItemsList: TSummaryLineItemProps[] = [
    {
      label: "Base rate",
      amount: summaryData.baseRate,
      primaryTextHighlight: Boolean(summaryData.baseRate),
    },
    {
      label: "Discount on base rate",
      amount: summaryData.promotionDiscount,
      primaryTextHighlight: Boolean(summaryData.promotionDiscount),
    },
    {
      label: "Final base rate",
      amount: summaryData.finalBaseRate,
      primaryTextHighlight: Boolean(summaryData.finalBaseRate),
    },
    {
      label: "Total miscellaneous charges",
      amount: summaryData.totalMiscChargesTaxable,
      primaryTextHighlight: Boolean(summaryData.totalMiscChargesTaxable),
    },
    {
      label: "Total miscellaneous charges (non-taxable)",
      amount: summaryData.totalMiscChargesNonTaxable,
      primaryTextHighlight: Boolean(summaryData.totalMiscChargesNonTaxable),
    },
    {
      label: "Extra mileage charges",
      amount: summaryData.extraMilesCharge,
      primaryTextHighlight: Boolean(summaryData.extraMilesCharge),
      shown: summaryData.isExtraMileageChargeTaxable || false,
    },
    {
      label: "Extra duration charges",
      amount: summaryData.extraDayCharge,
      primaryTextHighlight: Boolean(summaryData.extraDayCharge),
      shown: summaryData.isExtraDayChargeTaxable || false,
    },
    {
      label: "Fuel charges",
      amount: summaryData.extraFuelCharge,
      primaryTextHighlight: Boolean(summaryData.extraFuelCharge),
      shown: summaryData.isFuelChargeTaxable || false,
    },
    {
      label: "Pre-tax adjustments",
      amount: summaryData.preAdjustment,
      primaryTextHighlight: Boolean(summaryData.preAdjustment),
      shown: Boolean(summaryData.preAdjustment),
    },
    {
      label: "Pre-discount on subtotal",
      amount: summaryData.preSubTotal,
      primaryTextHighlight: Boolean(summaryData.preSubTotal),
      shown: Boolean(summaryData.promotionDiscountOnSubTotal),
    },
    {
      label: "Discount on subtotal",
      amount: summaryData.promotionDiscountOnSubTotal,
      primaryTextHighlight: Boolean(summaryData.promotionDiscountOnSubTotal),
      shown: Boolean(summaryData.promotionDiscountOnSubTotal),
    },
    {
      label: "Subtotal",
      amount: summaryData.subTotal,
      primaryTextHighlight: Boolean(summaryData.subTotal),
    },
    {
      label: "Total taxes",
      amount: summaryData.totalTax,
      primaryTextHighlight: Boolean(summaryData.totalTax),
    },
    {
      label: "Extra mileage charges",
      amount: summaryData.extraMilesCharge,
      primaryTextHighlight: Boolean(summaryData.extraMilesCharge),
      shown: !summaryData.isExtraMileageChargeTaxable || false,
    },
    {
      label: "Extra duration charges",
      amount: summaryData.extraDayCharge,
      primaryTextHighlight: Boolean(summaryData.extraDayCharge),
      shown: !summaryData.isExtraDayChargeTaxable || false,
    },
    {
      label: "Fuel charges",
      amount: summaryData.extraFuelCharge,
      primaryTextHighlight: Boolean(summaryData.extraFuelCharge),
      shown: !summaryData.isFuelChargeTaxable || false,
    },
    {
      label: "Additional charges",
      amount: summaryData.additionalCharge,
      primaryTextHighlight: Boolean(summaryData.additionalCharge),
      shown: Boolean(summaryData.additionalCharge),
    },
    {
      label: "Post-tax adjustments",
      amount: summaryData.postAdjustment,
      primaryTextHighlight: Boolean(summaryData.postAdjustment),
      shown: Boolean(summaryData.postAdjustment),
    },
    {
      label: "Grand total",
      amount: summaryData.total,
      primaryBlockHighlight: true,
      biggerText: true,
    },
    {
      label: "Amount paid",
      amount: summaryData.amountPaid,
      primaryTextHighlight: Boolean(summaryData.amountPaid),
    },
    {
      label: "Balance due",
      amount: summaryData.balanceDue,
      redHighlight: Boolean(summaryData.balanceDue),
    },
    {
      label: "Security deposit",
      amount: summaryData.securityDeposit,
      primaryTextHighlight: Boolean(summaryData.securityDeposit),
    },
  ].map((item, idx) => ({ ...item, id: `${module}-summary-${idx}` }));

  return (
    <div className="grid divide-y divide-gray-200 rounded bg-white py-1 shadow-sm">
      <SummaryHeader
        title="Summary of charges"
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

export default RentalRatesSummary;
