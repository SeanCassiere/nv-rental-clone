import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { agreementQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetAgreementsList(params: {
  page: number;
  pageSize: number;
  filters: Omit<
    QueryParams,
    "clientId" | "userId" | "page" | "pageSize" | "currentDate"
  >;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
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
        currentDate: new Date(),
        ...params.filters,
      }),
    enabled: enabled && auth.isAuthenticated,
    placeholderData: (prev) => prev,
  });
  return query;
}

type QueryParams = Omit<
  Parameters<(typeof apiClient)["agreement"]["getList"]>[0]["query"],
  "currentDate"
> & {
  currentDate: Date;
};

export async function fetchAgreementsListModded(params: QueryParams) {
  const { clientId, userId, page, pageSize, currentDate, ...filters } = params;
  return await apiClient.agreement.getList({
    query: {
      clientId: params.clientId,
      userId: params.userId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      currentDate: params.currentDate.toISOString(),
      ...filters,
    },
  });
}
