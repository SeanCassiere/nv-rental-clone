import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { makeInitialApiData } from "../../../api/fetcher";

import { fetchLocationsList } from "../../../api/locations";
import { locationQKeys } from "../../../utils/query-key";

export function useGetLocationsList(params: { locationIsActive: boolean }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: locationQKeys.all(),
    queryFn: async () =>
      await fetchLocationsList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        withActive: params.locationIsActive,
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([]),
  });
  return query;
}
