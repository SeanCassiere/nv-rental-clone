import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { makeInitialApiData } from "../../../api/fetcher";
import { fetchVehiclesList } from "../../../api/vehicles";
import { validateApiResWithZodSchema } from "../../../utils/schemas/apiFetcher";
import { VehicleListItemListSchema } from "../../../utils/schemas/vehicle";

export function useGetVehiclesList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: [
      "vehicles",
      { page: params.page, pageSize: params.pageSize },
      params.filters,
    ],
    queryFn: () =>
      fetchVehiclesList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
      })
        .then((res) => {
          if (res.ok) return res;
          return { ...res, data: [] };
        })
        .then((res) =>
          validateApiResWithZodSchema(VehicleListItemListSchema, res)
        )
        .catch((e) => {
          console.error(e);
          throw e;
        }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
