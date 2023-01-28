import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchAgreementData } from "../../../api/agreements";
import { agreementQKeys } from "../../../utils/query-key";

export function useGetAgreementData(params: {
  agreementId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.id(params.agreementId),
    queryFn: async () =>
      fetchAgreementData({
        agreementId: params.agreementId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled:
      auth.isAuthenticated &&
      Boolean(params.agreementId && params.agreementId !== "0"),
    onError: (err) => {
      if (params?.onError) {
        params?.onError(err);
      }
    },
    retry: 2,
  });
  return query;
}
