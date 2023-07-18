import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchReservationTypesList } from "@/api/reservations";
import { reservationQKeys } from "@/utils/query-key";

export function useGetReservationTypesList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: reservationQKeys.types(),
    queryFn: async () =>
      await fetchReservationTypesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
