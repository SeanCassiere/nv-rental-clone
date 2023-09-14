import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

export function useGetTaxes(params: {
  enabled?: boolean;
  filters?: Omit<
    Parameters<(typeof apiClient)["tax"]["getList"]>[0]["query"],
    "userId" | "clientId"
  >;
}) {
  const { enabled = true, filters = { LocationId: "0" } } = params;
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["taxes", filters],
    queryFn: () =>
      apiClient.tax.getList({
        query: {
          userId: auth.user?.profile.navotar_userid || "",
          clientId: auth.user?.profile.navotar_clientid || "",
          LocationId: filters.LocationId,
          AgreementId: filters.AgreementId,
        },
      }),
    enabled: auth.isAuthenticated && enabled,
  });
  return query;
}
