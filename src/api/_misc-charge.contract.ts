import { z } from "zod";

import { c } from "@/api/c";

import { MiscChargeListItemSchema } from "@/schemas/misc-charge";

import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";

const rootMiscChargeContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/misccharges",
    query: UserAndClientIdAuthSchema.extend({
      Active: z.enum(["true", "false"]),
      CheckoutDate: z.string().optional(),
      CheckinDate: z.string().optional(),
      LocationId: z.number().optional(),
      VehicleTypeId: z.number().optional(),
      AgreementId: z.string().optional(),
    }),
    responses: {
      200: z.array(MiscChargeListItemSchema.passthrough()),
      404: StructuredErrorSchema,
    },
  },
});

export { rootMiscChargeContract };
