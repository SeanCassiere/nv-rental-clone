import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchReservationData } from "../../../api/reservation";
import { reservationQKeys } from "../../../utils/query-key";

export function useGetReservationData(params: {
  reservationId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: reservationQKeys.id(params.reservationId),
    queryFn: async () =>
      fetchReservationData({
        reservationId: params.reservationId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    onError: (err) => {
      if (params?.onError) {
        params?.onError(err);
      }
    },
    retry: 2,
  });
  return query;
}
