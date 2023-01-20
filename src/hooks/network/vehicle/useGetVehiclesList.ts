import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import { fetchVehiclesList } from "../../../api/vehicles";
import {
  VehicleListItemListSchema,
  type TVehicleListItemParsed,
} from "../../../utils/schemas/vehicle";

export function useGetVehiclesList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<TVehicleListItemParsed[]>>({
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
        .then((dataObj) => {
          const parsed = VehicleListItemListSchema.parse(dataObj.data);

          return { ...dataObj, data: parsed };
        })
        .catch((e) => {
          console.log(e);
          throw e;
        }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
