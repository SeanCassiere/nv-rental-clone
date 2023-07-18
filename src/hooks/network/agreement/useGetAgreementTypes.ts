import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchAgreementTypesList } from "@/api/agreements";
import { agreementQKeys } from "@/utils/query-key";

export function useGetAgreementTypesList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.types(),
    queryFn: async () =>
      await fetchAgreementTypesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
