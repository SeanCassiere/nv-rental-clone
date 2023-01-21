import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementData } from "../../../api/agreements";
import { agreementQKeys } from "../../../utils/query-key";
import { type AgreementDataParsed } from "../../../utils/schemas/agreement";

export function useGetAgreementData(params: {
  agreementId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery<AgreementDataParsed>({
    queryKey: agreementQKeys.id(params.agreementId),
    queryFn: async () =>
      fetchAgreementData({
        agreementId: params.agreementId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    onError: (err) => {
      if (params?.onError) {
        params?.onError(err);
      }
    },
    retry: 2,
  });
  return query;
}
