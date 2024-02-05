import { z } from "zod";

import { c } from "@/lib/api/c";
import { OptimalRateSchema, RentalRateSchema } from "@/lib/schemas/rate";

import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";

const rootRateContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/rates",
    query: UserAndClientIdAuthSchema.extend({
      VehicleTypeId: z.string().optional(),
      CheckoutDate: z.string().optional(),
      CheckinDate: z.string().optional(),
      LocationId: z.string().optional(),
      RateName: z.string().optional(),
      AgreementId: z.string().optional(),
      AgreementTypeName: z.string().optional(),
    }),
    responses: {
      200: z.array(RentalRateSchema.passthrough()),
      404: StructuredErrorSchema,
    },
  },
  getOptimal: {
    method: "GET",
    path: "/v3/rates/ratesname/optimal",
    query: UserAndClientIdAuthSchema.extend({
      CheckoutDate: z.string(),
      CheckinDate: z.string(),
      VehicleTypeId: z.string(),
      LocationId: z.string(),
    }),
    responses: {
      200: OptimalRateSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootRateContract };
