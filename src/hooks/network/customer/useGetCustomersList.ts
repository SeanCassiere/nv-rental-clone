import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchCustomersList } from "../../../api/customer";
import { makeInitialApiData } from "../../../api/fetcher";
import { CustomerListItemListSchema } from "../../../utils/schemas/customer";
import { validateApiResWithZodSchema } from "../../../utils/schemas/apiFetcher";

export function useGetCustomersList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: [
      "customers",
      { page: params.page, pageSize: params.pageSize },
      params.filters,
    ],
    queryFn: () =>
      fetchCustomersList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
      })
        .then((res) => {
          if (res.ok) return res;
          return { ...res, data: [] };
        })
        .then((res) =>
          validateApiResWithZodSchema(CustomerListItemListSchema, res)
        )
        .catch((e) => {
          console.error(e);
          throw e;
        }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
