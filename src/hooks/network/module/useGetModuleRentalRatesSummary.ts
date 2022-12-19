import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchRentalRateSummaryAmounts } from "../../../api/summary";
import {
  RentalRatesSummarySchema,
  type TRentalRatesSummarySchema,
} from "../../../utils/schemas/summary";

export function useGetModuleRentalRatesSummary(params: {
  module: "reservations" | "agreements";
  referenceId: string;
}) {
  const auth = useAuth();
  const query = useQuery<TRentalRatesSummarySchema>({
    queryKey: [
      params.module === "agreements" ? "agreementView" : "reservationView",
      params.referenceId,
      "summary",
    ],
    queryFn: async () =>
      await fetchRentalRateSummaryAmounts({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        module: params.module,
        referenceId: params.referenceId,
      }),

    enabled: auth.isAuthenticated,
    initialData: RentalRatesSummarySchema.parse({
      baseRate: 0.0,
      totalDays: 0.0,
      miscCharges: [] as any[],
      totalMiscChargesTaxable: 0.0,
      totalMiscChargesNonTaxable: 0.0,
      subTotal: 0.0,
      totalTax: 0.0,
      dropOffCharges: 0.0,
      total: 0.0,
      promotionDiscount: 0.0,
      rateSummaryItems: [] as any[],
      avgPerDayRate: 0.0,
      taxes: [] as any[],
      promotions: [] as any[],
      maxTotalDays: 0.0,
      freeMiles: 0.0,
      extraMilesCharge: 0.0,
      initialCharge: 0.0,
      initialChargeHours: 0,
      avgPerHourRate: 0.0,
      advancePayment: 0.0,
      balanceDue: 0.0,
      inventoryCharges: [] as any[],
      totalInventoryChargesTaxable: 0.0,
      totalInventoryChargesNonTaxable: 0.0,
      finalBaseRate: 0.0,
      preAdjustment: 0.0,
      additionalCharge: 0.0,
      postAdjustment: 0.0,
      promotionDiscountOnSubTotal: 0.0,
      isHourlySlottedRate: false,
      securityDeposit: 0.0,
      estimateTotalwithDeposit: 0.0,
      preSubTotal: 0.0,
      cancellationCharge: null,
      extraDayCharge: 0.0,
      extraFuelCharge: 0.0,
      agreementCharges: 0.0,
      fineCharges: 0.0,
      amountPaid: 0.0,
      writeOffAmount: 0.0,
      totalKmUsed: null,
      extraKMUsed: 0.0,
      insuranceBaseCharge: 0.0,
      insuranceTotalTax: 0.0,
      insuranceTotal: 0.0,
      customerBaseCharge: 0.0,
      customerTotalTax: 0.0,
      customerTotal: 0.0,
      insurancePaidAmount: 0.0,
      customerPaidAmount: 0.0,
      insuranceBalanceAmount: 0.0,
      customerBalanceAmount: 0.0,
      reimbursementAmount: 0.0,
      securityDepositPercentage: 0.0,
      unTaxableAdditional: 0.0,
      isExtraMileageChargeTaxable: false,
      isExtraDayChargeTaxable: false,
      isFuelChargeTaxable: false,
      insuranceTotalMiscChargesNonTaxable: 0.0,
      customerTotalMiscChargesNonTaxable: 0,
      taxListString: "",
    }),
  });
  return query;
}
