import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchGlobalSearchList } from "@/api/search";

export function useGetGlobalSearch(params: { searchTerm: string }) {
  const { searchTerm } = params;

  const auth = useAuth();

  const query = useQuery({
    queryKey: ["app", "global-search", searchTerm],
    queryFn: async () => {
      return await fetchGlobalSearchList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        currentDate: new Date(),
        searchTerm,
      });
    },
  });
  return query;
}
