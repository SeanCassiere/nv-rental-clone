import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchCustomerTypesList } from "@/api/customers";
import { customerQKeys } from "@/utils/query-key";

export function useGetCustomerTypesList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: customerQKeys.types(),
    queryFn: async () =>
      await fetchCustomerTypesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
