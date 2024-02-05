import { z } from "zod";

import { c } from "@/lib/api/c";
import { VehicleExchangeItemListSchema } from "@/lib/schemas/vehicle-exchange";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootVehiclesExchangesContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/vehicleexchange",
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
