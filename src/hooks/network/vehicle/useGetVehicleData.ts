import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchVehicleData } from "../../../api/vehicles";
import { vehicleQKeys } from "../../../utils/query-key";
import { type VehicleDataParsed } from "../../../utils/schemas/vehicle";

export function useGetVehicleData(params: {
  vehicleId: string | number;
  onError?: (err: unknown) => void;
}) {
  const auth = useAuth();
  const query = useQuery<VehicleDataParsed>({
    queryKey: vehicleQKeys.id(params.vehicleId),
    queryFn: async () =>
      fetchVehicleData({
        vehicleId: params.vehicleId,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        clientTime: new Date(),
      }),
    enabled: auth.isAuthenticated,
    onError: (err) => {
      if (params?.onError) {
        params?.onError(err);
      }
    },
    retry: 2,
  });
  return query;
}
