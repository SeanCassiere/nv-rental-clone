import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchVehicleStatusesList } from "../../../api/vehicles";
import { type AgreementStatusListParsed } from "../../../utils/schemas/agreement";

export function useGetVehicleStatusList() {
  const auth = useAuth();
  const query = useQuery<AgreementStatusListParsed>({
    queryKey: ["vehicles", "statuses"],
    queryFn: async () =>
      await fetchVehicleStatusesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
