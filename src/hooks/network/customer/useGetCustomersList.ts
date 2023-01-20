import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchCustomersList } from "../../../api/customer";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import {
  CustomerListItemListSchema,
  type TCustomerListItemParsed,
} from "../../../utils/schemas/customer";

export function useGetCustomersList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<TCustomerListItemParsed[]>>({
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
        .then((dataObj) => {
          const parsed = CustomerListItemListSchema.parse(dataObj.data);

          return { ...dataObj, data: parsed };
        })
        .catch((e) => {
          console.log(e);
          throw e;
        }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
