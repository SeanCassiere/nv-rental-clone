import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchReservationStatusesList } from "@/api/reservations";
import { reservationQKeys } from "@/utils/query-key";
import { type AgreementStatusListParsed } from "@/schemas/agreement";

export function useGetReservationStatusList() {
  const auth = useAuth();
  const query = useQuery<AgreementStatusListParsed>({
    queryKey: reservationQKeys.statuses(),
    queryFn: async () =>
      await fetchReservationStatusesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
