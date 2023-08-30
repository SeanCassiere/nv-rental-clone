import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { agreementQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetNewAgreementNumber(params: {
  agreementType: string;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.generateNumber(params.agreementType),
    queryFn: () =>
      apiClient.agreement
        .generateNewNumber({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
            agreementType: params.agreementType,
          },
        })
        .then((res) =>
          res.status === 200 ? res.body : { agreementNo: "NONE" }
        ),
    enabled: enabled && auth.isAuthenticated,
  });
  return query;
}
