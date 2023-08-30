import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { customerQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetCustomerTypesList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: customerQKeys.types(),
    queryFn: () =>
      apiClient.customer
        .getTypes({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
