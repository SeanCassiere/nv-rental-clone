import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { customerQKeys } from "@/utils/query-key";

export function useGetCustomerData(params: { customerId: string | number }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: customerQKeys.id(params.customerId),
    queryFn: () =>
      apiClient.getCustomerById({
        params: {
          customerId: String(params.customerId),
        },
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
        },
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
