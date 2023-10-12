import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { reservationQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetReservationStatusList(opts?: { enabled?: boolean }) {
  const { enabled = true } = opts || {};

  const auth = useAuth();
  const query = useQuery({
    queryKey: reservationQKeys.statuses(),
    queryFn: () =>
      apiClient.reservation
        .getStatuses({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: auth.isAuthenticated && enabled,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
