import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchRentalRateTypes } from "../../../api/rates";

export function useGetRentalRateTypes(opts: {
  enabled?: boolean;
  filters: Omit<
    Parameters<typeof fetchRentalRateTypes>[0],
    "userId" | "clientId" | "accessToken"
  >;
}) {
  const auth = useAuth();

  const { enabled, filters } = opts;

  const isEnabled = typeof enabled !== "undefined" ? enabled : true;

  const query = useQuery({
    queryKey: ["rates", "types", JSON.stringify(opts)],
    queryFn: async () => {
      return await fetchRentalRateTypes({
        accessToken: auth.user?.access_token || "",
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        ...filters,
      });
    },
    enabled: auth.isAuthenticated && isEnabled,
    initialData: [],
  });

  return query;
}
