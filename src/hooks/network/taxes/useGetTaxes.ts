import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchTaxesList } from "@/api/taxes";

export function useGetTaxes(params: {
  enabled?: boolean;
  filters?: Omit<
    Parameters<typeof fetchTaxesList>[0],
    "accessToken" | "userId" | "clientId"
  >;
}) {
  const { enabled = true, filters = { LocationId: 0 } } = params;
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["taxes", filters],
    queryFn: async () => {
      return await fetchTaxesList({
        accessToken: auth.user?.access_token || "",
        userId: auth.user?.profile.navotar_userid || "",
        clientId: auth.user?.profile.navotar_clientid || "",
        LocationId: filters.LocationId,
      });
    },
    enabled: auth.isAuthenticated && enabled,
  });
  return query;
}
