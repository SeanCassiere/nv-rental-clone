import { z } from "zod";

import { c } from "@/api/c";
import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import { VehicleExchangeItemListSchema } from "@/schemas/vehicleExchange";

const rootVehiclesExchangesContract = c.router({
  getVehicleExchanges: {
    method: "GET",
    path: "/v3/vehicleexchanges",
    query: UserAndClientIdAuthSchema.extend({
      agreementId: z.string(),
    }),
    responses: {
      200: VehicleExchangeItemListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootVehiclesExchangesContract };
