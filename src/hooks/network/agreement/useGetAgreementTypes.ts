import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { agreementQKeys } from "@/utils/query-key";

export function useGetAgreementTypesList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.types(),
    queryFn: () =>
      apiClient
        .getAgreementTypes({
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
