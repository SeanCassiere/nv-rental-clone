import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchCustomersList } from "../../../api/customer";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import type { CustomerListItemType } from "../../../types/Customer";

export function useGetCustomersList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<CustomerListItemType[]>>({
    queryKey: [
      "customers",
      JSON.stringify({ page: params.page, pageSize: params.pageSize }),
      JSON.stringify(params.filters),
    ],
    queryFn: () =>
      fetchCustomersList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
      }).then((dataObj) => {
        const updated = dataObj.data.map((customer: any) => ({
          ...customer,
          id: `${customer?.AgreementId}`,
        }));

        return { ...dataObj, data: updated };
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
