import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchDashboardStats } from "../../api/dashboard";
import type { DashboardStatsType } from "../../types/Dashboard";

export function useGetDashboardStats({
  locationId,
  clientDate,
}: {
  locationId: number;
  clientDate: Date;
}) {
  const auth = useAuth();
  const query = useQuery<DashboardStatsType>({
    queryKey: ["dashboard", "stats"],
    queryFn: () =>
      fetchDashboardStats({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        locationId,
        clientDate,
      }),
    enabled: auth.isAuthenticated,
    initialData: {
      openAgreement: 0,
      overDues: 0,
      dueIn: 0,
      todaysReservationCount: 0,
      todaysArrivalsCount: 0,
      serviceAlerts: 0,
      onHoldAgreements: 0,
      paymentDelay: 0,
      pendingPayment: 0,
    },
  });
  return query;
}
