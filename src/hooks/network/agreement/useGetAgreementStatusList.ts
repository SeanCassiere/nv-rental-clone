import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { agreementQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetAgreementStatusList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.statuses(),
    queryFn: () =>
      apiClient
        .getAgreementStatuses({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
