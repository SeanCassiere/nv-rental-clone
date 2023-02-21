import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchRentalRates } from "../../../api/rates";

export function useGetRentalRates(opts?: {
  enabled?: boolean;
  filters: Omit<
    Parameters<typeof fetchRentalRates>[0],
    "userId" | "clientId" | "accessToken"
  >;
}) {
  const auth = useAuth();

  const { enabled, filters = {} } = opts ?? {};

  const isEnabled = typeof enabled !== "undefined" ? enabled : true;

  const query = useQuery({
    queryKey: ["rates", JSON.stringify(opts)],
    queryFn: async () => {
      return await fetchRentalRates({
        clientId: auth.user?.profile.navotar_clientid || "",
        accessToken: auth.user?.access_token || "",
        userId: auth.user?.profile.navotar_userid || "",
        ...filters,
      });
    },
    enabled: auth.isAuthenticated && isEnabled,
    initialData: [],
  });

  return query;
}
