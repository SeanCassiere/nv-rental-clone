import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchVehicleSummaryAmounts } from "@/api/summary";

import { fleetQKeys } from "@/utils/query-key";

export function useGetVehicleSummary(params: { vehicleId: string | number }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.summary(params.vehicleId),
    queryFn: async () =>
      await fetchVehicleSummaryAmounts({
        vehicleId: params.vehicleId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        clientDate: new Date(),
      }),
    initialData: {
      currentReservation: "0",
      vehicleMakeName: "",
      vehicleTypeId: 0,
      vehicleType: "",
      totalNoOfAgreement: 0,
      futureNoOfAgreement: 0,
      totalNoOfReservation: 0,
      totalRevenue: 0,
      totalExpense: 0,
      totalProfit: 0,
      monthlyRevenue: 0,
      monthlyExpense: 0,
      monthlyProfit: 0,
      monthlyPayment: 0,
      leasePayoutAmount: 0,
      currentAgreement: "0",
      futureNoOfReservation: 0,
      pendingPayment: 0,
      createdBy: "",
      editedBy: "",
      balanceOwing: 0,
      owningLocationId: 0,
      owningLocationName: "",
      finalPaymentDate: null,
      currentNetValue: 0,
      monthlyDepreciation: 0,
      totalAmountDepreciated: 0,
      lastRentalDate: null,
    },
  });
  return query;
}
