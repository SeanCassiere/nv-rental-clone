import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchNewAgreementNo } from "@/api/agreements";
import { agreementQKeys } from "@/utils/query-key";
import { type GenerateAgreementNoDataParsed } from "@/schemas/agreement";

export function useGetNewAgreementNumber(params: {
  agreementType: string;
  onSuccess?: (data: GenerateAgreementNoDataParsed) => void;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.generateNumber(params.agreementType),
    queryFn: async () =>
      await fetchNewAgreementNo({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        agreementType: params.agreementType,
      }),
    enabled: enabled && auth.isAuthenticated,
    onSuccess: (data) => {
      params?.onSuccess?.(data);
    },
  });
  return query;
}
