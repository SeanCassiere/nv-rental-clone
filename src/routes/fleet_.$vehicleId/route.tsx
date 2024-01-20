import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchVehiclesByIdOptions,
  fetchVehiclesSummaryByIdOptions,
} from "@/utils/query/vehicle";

export const Route = new FileRoute("/fleet/$vehicleId").createRoute({
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
  beforeLoad: ({ context, params: { vehicleId }, search }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewVehicleSummaryOptions: fetchVehiclesSummaryByIdOptions({
        auth,
        vehicleId,
      }),
      viewVehicleOptions: fetchVehiclesByIdOptions({ auth, vehicleId }),
      viewTab: search?.tab || "",
    };
  },
});
