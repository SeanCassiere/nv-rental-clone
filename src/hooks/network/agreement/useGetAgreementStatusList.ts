import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { agreementQKeys } from "@/utils/query-key";
import { type AgreementStatusListParsed } from "@/schemas/agreement";

export function useGetAgreementStatusList() {
  const auth = useAuth();
  const query = useQuery<AgreementStatusListParsed>({
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
