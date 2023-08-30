import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { agreementQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetVehicleExchanges(params: {
  agreementId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.exchanges(params.agreementId),
    queryFn: () =>
      apiClient.exchange.getList({
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
