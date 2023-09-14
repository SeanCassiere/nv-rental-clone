import { z } from "zod";

import { c } from "@/api/c";

import { RentalRateTypeListSchema } from "@/schemas/rate";

import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";

const rootRateTypeContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/ratetypes",
    query: UserAndClientIdAuthSchema.extend({
      VehicleTypeId: z.string().optional(),
      LocationId: z.string().optional(),
    }),
    responses: {
      200: RentalRateTypeListSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootRateTypeContract };
