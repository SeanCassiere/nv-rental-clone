import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementStatusesList } from "../../../api/agreements";
import { type AgreementStatusListParsed } from "../../../utils/schemas/agreement";

export function useGetAgreementStatusList() {
  const auth = useAuth();
  const query = useQuery<AgreementStatusListParsed>({
    queryKey: ["agreements", "statuses"],
    queryFn: async () =>
      await fetchAgreementStatusesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
