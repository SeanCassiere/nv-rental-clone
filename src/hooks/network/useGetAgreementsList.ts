import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementsList } from "../../api/agreements";
import { makeInitialApiData, type ResponseParsed } from "../../api/fetcher";
import type { AgreementListItemType } from "../../types/Agreement";

export function useGetAgreementsList(params: {
  page: number;
  pageSize: number;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<AgreementListItemType[]>>({
    queryKey: ["agreements", JSON.stringify(params)],
    queryFn: () =>
      fetchAgreementsList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        currentDate: new Date(),
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
