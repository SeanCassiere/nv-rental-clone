import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { reservationQKeys } from "@/utils/query-key";

export function useGetReservationData(params: {
  reservationId: string | number;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: reservationQKeys.id(params.reservationId),
    queryFn: async () =>
      apiClient.getReservationById({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
        },
        params: {
          reservationId: String(params.reservationId),
        },
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
