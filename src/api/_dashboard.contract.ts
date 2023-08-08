import { z } from "zod";

import { c } from "@/api/c";
import {
  ClientIdAuthSchema,
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import {
  DashboardStatsSchema,
  SalesStatusParse,
  ServerMessageListSchema,
  VehicleStatusCountListSchema,
} from "@/schemas/dashboard";

const DashboardExtraParams = {
  ClientDate: z.string(),
  LocationId: z.string().optional(),
  MultipleLocation: z.array(z.string()).optional(),
};

const rootDashboardContract = c.router({
  getApplicationMessages: {
    method: "GET",
    path: "/v3/messages",
    query: ClientIdAuthSchema,
    responses: {
      200: ServerMessageListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatisticsForRentals: {
    method: "GET",
    path: "/v3/statistics",
    query: UserAndClientIdAuthSchema.extend(DashboardExtraParams),
    responses: {
      200: DashboardStatsSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatisticsForVehiclesStatuses: {
    method: "GET",
    path: "/v3/statistics/vehiclestatuscounts",
    query: UserAndClientIdAuthSchema.extend(DashboardExtraParams).extend({
      VehicleType: z.string().optional(),
    }),
    responses: {
      200: VehicleStatusCountListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatisticsForSales: {
    method: "GET",
    path: "/v3/statistics/sales",
    query: UserAndClientIdAuthSchema.extend(DashboardExtraParams),
    responses: {
      200: SalesStatusParse,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootDashboardContract };
