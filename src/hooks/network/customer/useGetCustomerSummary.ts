import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchCustomerSummaryAmounts } from "../../../api/summary";
import { type TCustomerSummarySchema } from "../../../utils/schemas/summary/customerSummary";

export function useGetCustomerSummary(params: { customerId: string | number }) {
  const auth = useAuth();
  const query = useQuery<TCustomerSummarySchema>({
    queryKey: ["customerView", params.customerId, "summary"],
    queryFn: async () =>
      await fetchCustomerSummaryAmounts({
        customerId: params.customerId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    initialData: {
      customerId: Number(params.customerId),
      firstName: "",
      lastName: "",
      openedReservation: 0,
      confirmedReservation: 0,
      noShowReservation: 0,
      cancelledReservation: 0,
      openedAgreements: 0,
      closedAgreements: 0,
      totalTrafficTickets: 0,
      pendingPayments: 0,
      pendingDeposit: 0,
      totalRevenue: 0,
    },
  });
  return query;
}
