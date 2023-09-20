import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { locationQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetLocationsList(params: {
  query: { withActive: boolean };
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: locationQKeys.all(params.query),
    queryFn: () =>
      apiClient.location.getList({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
          withActive: params.query.withActive,
        },
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
