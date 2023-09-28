import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { customerQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetCustomersList(params: {
  page: number;
  pageSize: number;
  filters: Omit<QueryParams, "clientId" | "userId" | "page" | "pageSize">;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
  const auth = useAuth();
  const query = useQuery({
    queryKey: customerQKeys.search({
      pagination: { page: params.page, pageSize: params.pageSize },
      filters: params.filters,
    }),
    queryFn: () =>
      fetchCustomersListModded({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        ...params.filters,
      }),
    enabled: enabled && auth.isAuthenticated,
    placeholderData: keepPreviousData,
  });
  return query;
}

type QueryParams = Parameters<
  (typeof apiClient)["customer"]["getList"]
>[0]["query"];

export async function fetchCustomersListModded(params: QueryParams) {
  const { clientId, userId, page = 1, pageSize = 10, ...filters } = params;
  return await apiClient.customer.getList({
    query: {
      clientId: clientId,
      userId: userId,
      page: page,
      pageSize: pageSize,
      ...filters,
    },
  });
}
