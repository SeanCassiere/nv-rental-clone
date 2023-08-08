import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { agreementQKeys } from "@/utils/query-key";

export function useGetVehicleExchanges(params: {
  agreementId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.exchanges(params.agreementId),
    queryFn: () =>
      apiClient.getVehicleExchanges({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
          agreementId: `${params.agreementId}`,
        },
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
