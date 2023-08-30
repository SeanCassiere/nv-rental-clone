import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { customerQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetCustomerSummary(params: { customerId: string | number }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: customerQKeys.summary(params.customerId),
    queryFn: () =>
      apiClient.customer.getSummaryForId({
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
