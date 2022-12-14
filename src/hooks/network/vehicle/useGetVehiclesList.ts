import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { VehicleListItemType } from "../../../types/Vehicle";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import { fetchVehiclesList } from "../../../api/vehicles";

export function useGetVehiclesList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<VehicleListItemType[]>>({
    queryKey: [
      "vehicles",
      JSON.stringify({ page: params.page, pageSize: params.pageSize }),
      JSON.stringify(params.filters),
    ],
    queryFn: () =>
      fetchVehiclesList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
      }).then((dataObj) => {
        const updated = dataObj.data.map((vehicle: any) => ({
          ...vehicle,
          id: `${vehicle?.VehicleId}`,
        }));

        return { ...dataObj, data: updated };
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
