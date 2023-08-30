import { z } from "zod";

import { c } from "@/api/c";

import { AgreementStatusListSchema } from "@/schemas/agreement";
import { VehicleSummarySchema } from "@/schemas/summary";
import {
  VehicleDataSchema,
  VehicleLevelListSchema,
  VehicleTypeLookupList,
} from "@/schemas/vehicle";

import {
  // PaginationSchema,
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootVehicleContract = c.router({
  getById: {
    method: "GET",
    path: "/v3/vehicles/:vehicleId",
    query: UserAndClientIdAuthSchema.extend({
      getMakeDetails: z.enum(["true", "false"]),
      clientTime: z.string(),
    }),
    responses: {
      200: VehicleDataSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatuses: {
    method: "GET",
    path: "/v3/vehicles/statuses",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementStatusListSchema,
    },
  },
  getTypesLookupList: {
    method: "GET",
    path: "/v3/vehicles/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: VehicleTypeLookupList,
    },
  },
  getFuelLevels: {
    method: "GET",
    path: "/v3/vehicles/fuellevels",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: VehicleLevelListSchema,
    },
  },
  getSummaryForId: {
    method: "GET",
    path: "/v3/vehicles/:vehicleId/summary",
    query: UserAndClientIdAuthSchema.extend({
      clientTime: z.string(),
    }),
    responses: {
      200: VehicleSummarySchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootVehicleContract };
