import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { agreementQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetAgreementData(params: { agreementId: string | number }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.id(params.agreementId),
    queryFn: () =>
      apiClient.agreement.getById({
        params: {
          agreementId: String(params.agreementId),
        },
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
        },
      }),
    enabled:
      auth.isAuthenticated &&
      Boolean(params.agreementId && params.agreementId !== "0"),
  });
  return query;
}
