import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchVehiclesList } from "@/api/vehicles";
import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { fleetQKeys } from "@/utils/query-key";
import { validateApiResWithZodSchema } from "@/schemas/apiFetcher";
import { VehicleListItemListSchema } from "@/schemas/vehicle";

export function useGetVehiclesList(params: {
  page: number;
  pageSize: number;
  filters: any;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.search({
      pagination: { page: params.page, pageSize: params.pageSize },
      filters: params.filters,
    }),
    queryFn: () =>
      fetchVehiclesListModded({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
      }),
    enabled: enabled && auth.isAuthenticated,
    keepPreviousData: true,
  });
  return query;
}

export async function fetchVehiclesListModded(
  params: Parameters<typeof fetchVehiclesList>[0]
) {
  return await fetchVehiclesList({
    clientId: params.clientId || "",
    userId: params.userId || "",
    accessToken: params.accessToken || "",
    page: params?.page,
    pageSize: params?.pageSize,
    filters: {
      ...params.filters,
      ...("StartDate" in params.filters
        ? {
            StartDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
              params.filters.StartDate
            ),
          }
        : {}),
      ...("EndDate" in params.filters
        ? {
            EndDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
              params.filters.EndDate
            ),
          }
        : {}),
    },
  })
    .then((res) => {
      if (res.ok) return res;
      return { ...res, data: [] };
    })
    .then((res) => validateApiResWithZodSchema(VehicleListItemListSchema, res))
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
