import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

export function useGetMiscCharges(params: {
  enabled?: boolean;
  filters?: Omit<
    Parameters<(typeof apiClient)["miscCharge"]["getList"]>[0]["query"],
    "clientId" | "userId"
  >;
}) {
  const { enabled = true, filters = {} } = params;
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["misc-charges", filters],
    queryFn: () =>
      apiClient.miscCharge.getList({
        query: {
          userId: auth.user?.profile.navotar_userid || "",
          clientId: auth.user?.profile.navotar_clientid || "",
          Active: "true",
          ...filters,
        },
      }),
    enabled: auth.isAuthenticated && enabled,
  });
  return query;
}
