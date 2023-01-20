import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementsList } from "../../../api/agreements";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import {
  AgreementListItemListSchema,
  type TAgreementListItemParsed,
} from "../../../utils/schemas/agreement";

export function useGetAgreementsList(params: {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<TAgreementListItemParsed[]>>({
    queryKey: [
      "agreements",
      { page: params.page, pageSize: params.pageSize },
      params.filters,
    ],
    queryFn: () =>
      fetchAgreementsList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        currentDate: new Date(),
        filters: params.filters,
      }).then((dataObj) => {
        const parsed = AgreementListItemListSchema.parse(dataObj.data);

        return { ...dataObj, data: parsed };
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
    keepPreviousData: true,
  });
  return query;
}
