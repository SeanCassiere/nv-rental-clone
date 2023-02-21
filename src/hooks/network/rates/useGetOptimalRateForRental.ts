import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchOptimalRateForRental } from "../../../api/rates";

export function useGetOptimalRateForRental(opts: {
  enabled?: boolean;
  filters: Omit<
    Parameters<typeof fetchOptimalRateForRental>[0],
    "userId" | "clientId" | "accessToken"
  >;
  onSuccess?: (
    data: Awaited<ReturnType<typeof fetchOptimalRateForRental>>
  ) => void;
}) {
  const auth = useAuth();

  const { enabled, filters } = opts;

  const isEnabled = typeof enabled !== "undefined" ? enabled : true;

  const query = useQuery({
    queryKey: ["rates", "optimal", JSON.stringify(opts)],
    queryFn: async () => {
      return await fetchOptimalRateForRental({
        accessToken: auth.user?.access_token || "",
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        ...filters,
      });
    },
    enabled: auth.isAuthenticated && isEnabled,
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
    initialData: null,
  });

  return query;
}
