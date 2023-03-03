import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementsList } from "../../../api/agreements";
import { AgreementListItemListSchema } from "../../../utils/schemas/agreement";
import { validateApiResWithZodSchema } from "../../../utils/schemas/apiFetcher";
import { agreementQKeys } from "../../../utils/query-key";

export function useGetAgreementsList(params: {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: agreementQKeys.search({
      pagination: { page: params.page, pageSize: params.pageSize },
      filters: params.filters,
    }),
    queryFn: () =>
      fetchAgreementsListModded({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        currentDate: new Date(),
        filters: params.filters,
      }),
    enabled: auth.isAuthenticated,
    keepPreviousData: true,
  });
  return query;
}

export async function fetchAgreementsListModded(
  params: Parameters<typeof fetchAgreementsList>[0]
) {
  return await fetchAgreementsList({
    clientId: params.clientId || "",
    userId: params.userId || "",
    accessToken: params.accessToken || "",
    page: params?.page,
    pageSize: params?.pageSize,
    currentDate: params.currentDate,
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
    });
}
