import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchCustomerData } from "@/api/customers";
import { customerQKeys } from "@/utils/query-key";

export function useGetCustomerData(params: { customerId: string | number }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: customerQKeys.id(params.customerId),
    queryFn: async () =>
      fetchCustomerData({
        customerId: params.customerId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    retry: 2,
  });
  return query;
}
