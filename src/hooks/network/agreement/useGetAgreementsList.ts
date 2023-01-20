import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementsList } from "../../../api/agreements";
import { makeInitialApiData } from "../../../api/fetcher";
import { AgreementListItemListSchema } from "../../../utils/schemas/agreement";
import { validateApiResWithZodSchema } from "../../../utils/schemas/apiFetcher";

export function useGetAgreementsList(params: {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
}) {
  const auth = useAuth();
  const query = useQuery({
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
      })
        .then((res) => {
          if (res.ok) return res;
          return { ...res, data: [] };
        })
        .then((res) =>
          validateApiResWithZodSchema(AgreementListItemListSchema, res)
        )
        .catch((e) => {
          console.error(e);
          throw e;
        }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([]),
    keepPreviousData: true,
  });
  return query;
}
