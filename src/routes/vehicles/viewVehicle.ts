import { lazy } from "@tanstack/react-router";
import { z } from "zod";

import { vehiclesRoute } from ".";
import { fetchVehicleSummaryAmounts } from "../../api/summary";
import { queryClient as qc } from "../../App";
import { getAuthToken } from "../../utils/authLocal";
import { vehicleQKeys } from "../../utils/query-key";

export const viewVehicleRoute = vehiclesRoute.createRoute({
  path: "$vehicleId",
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  onLoad: async ({ params: { vehicleId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = vehicleQKeys.summary(vehicleId);
      if (!qc.getQueryData(summaryKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchVehicleSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                vehicleId,
                clientDate: new Date(),
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../../pages/VehicleView/VehicleViewPage")),
  parseParams: (params) => ({
    vehicleId: z.string().parse(params.vehicleId),
  }),
  stringifyParams: (params) => ({ vehicleId: `${params.vehicleId}` }),
});
