import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchRentalRateTypesForRental } from "../../../api/rates";

export function useGetRentalRateTypesForRentals(opts: {
  enabled?: boolean;
  filters: Omit<
    Parameters<typeof fetchRentalRateTypesForRental>[0],
    "userId" | "clientId" | "accessToken"
  >;
}) {
  const auth = useAuth();

  const { enabled, filters } = opts;

  const isEnabled = typeof enabled !== "undefined" ? enabled : true;

  const query = useQuery({
    queryKey: ["rates", "types", JSON.stringify(opts)],
    queryFn: async () => {
      return await fetchRentalRateTypesForRental({
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
