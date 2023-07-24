import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchExchangesForAgreement } from "@/api/vehicleExchanges";
import { agreementQKeys } from "@/utils/query-key";

export function useGetVehicleExchanges(params: {
  agreementId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.exchanges(params.agreementId),
    queryFn: () =>
      fetchExchangesForAgreement({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        agreementId: `${params.agreementId}`,
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
