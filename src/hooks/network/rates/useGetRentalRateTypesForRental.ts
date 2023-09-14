import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

type QueryParams = Omit<
  Parameters<(typeof apiClient)["rateType"]["getList"]>[0]["query"],
  "userId" | "clientId"
>;

export function useGetRentalRateTypesForRentals(opts?: {
  enabled?: boolean;
  filters?: QueryParams;
}) {
  const auth = useAuth();

  const { enabled: isEnabled, filters = {} } = opts || {};

  const enabled = typeof isEnabled !== "undefined" ? isEnabled : true;

  const query = useQuery({
    queryKey: ["rate-types", filters],
    queryFn: () =>
      apiClient.rateType.getList({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
          ...filters,
        },
      }),
    enabled: enabled && auth.isAuthenticated,
  });

  return query;
}
