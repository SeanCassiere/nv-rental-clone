import { z } from "zod";

import { c } from "@/api/c";

import { VehicleTypeSchemaArray } from "@/schemas/vehicle-type";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

export type VehicleTypesListExtraOpts = Omit<
  z.infer<(typeof rootVehicleTypesContract)["getList"]["query"]>,
  "clientId" | "userId"
>;

const rootVehicleTypesContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/vehicletypes",
    query: UserAndClientIdAuthSchema.extend({
      StartDate: z.string().optional(),
      EndDate: z.string().optional(),
      VehicleTypeId: z.string().optional(),
      BaseRate: z.string().optional(),
      LocationId: z.string().optional(),
    }),
    responses: {
      200: VehicleTypeSchemaArray,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootVehicleTypesContract };
