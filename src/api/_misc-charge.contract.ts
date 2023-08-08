import { z } from "zod";

import { c } from "@/api/c";
import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";
import { MiscChargeListItemSchema } from "@/schemas/misCharges";

const rootMiscChargeContract = c.router({
  getMiscCharges: {
    method: "GET",
    path: "/v3/misccharges",
    query: UserAndClientIdAuthSchema.extend({
      Active: z.enum(["true", "false"]),
      CheckoutDate: z.string().optional(),
      CheckinDate: z.string().optional(),
      LocationId: z.number().optional(),
      VehicleTypeId: z.number().optional(),
    }),
    responses: {
      200: z.array(MiscChargeListItemSchema.passthrough()),
      404: StructuredErrorSchema,
    },
  },
});

export { rootMiscChargeContract };
