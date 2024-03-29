import { z } from "zod";

import { c } from "@/lib/api/c";
import { AgreementStatusListSchema } from "@/lib/schemas/agreement";
import { VehicleSummarySchema } from "@/lib/schemas/summary";
import {
  VehicleDataSchema,
  VehicleLevelListSchema,
  VehicleListItemListSchema,
  VehicleTypeLookupList,
} from "@/lib/schemas/vehicle";

import {
  PaginationSchema,
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
  getList: {
    method: "GET",
    path: "/v3/vehicles",
    query: UserAndClientIdAuthSchema.merge(PaginationSchema).extend({
      Active: z.string().optional(),
      SortDirection: z.string().optional(),
      LicenseNo: z.string().optional(),
      VehicleNo: z.string().optional(),
      VehicleId: z.string().optional(),
      VehicleStatus: z.string().optional(),
      VehicleTypeId: z.string().optional(),
      OwningLocationId: z.string().optional(),
      CurrentLocationId: z.string().optional(),
      StartDate: z.string().optional(),
      EndDate: z.string().optional(),
    }),
    responses: {
      200: VehicleListItemListSchema,
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
