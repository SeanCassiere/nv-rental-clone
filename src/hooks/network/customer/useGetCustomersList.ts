import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchCustomersList } from "../../../api/customers";
import { CustomerListItemListSchema } from "../../../utils/schemas/customer";
import { validateApiResWithZodSchema } from "../../../utils/schemas/apiFetcher";
import { customerQKeys } from "../../../utils/query-key";

export function useGetCustomersList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
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
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
      }),
    enabled: auth.isAuthenticated,
    keepPreviousData: true,
  });
  return query;
}

export async function fetchCustomersListModded(
  params: Parameters<typeof fetchCustomersList>[0]
) {
  return await fetchCustomersList({
    clientId: params.clientId || "",
    userId: params.userId || "",
    accessToken: params.accessToken || "",
    page: params?.page,
    pageSize: params?.pageSize,
    filters: params.filters,
  })
    .then((res) => {
      if (res.ok) return res;
      return { ...res, data: [] };
    })
    .then((res) => validateApiResWithZodSchema(CustomerListItemListSchema, res))
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
