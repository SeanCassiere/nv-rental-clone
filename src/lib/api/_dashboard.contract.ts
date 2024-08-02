import { z } from "zod";

import { c } from "@/lib/api/c";
import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import {
  DashboardStatsSchema,
  DashboardWidgetItemListSchema,
  SalesStatusParse,
  ServerMessageListSchema,
  VehicleStatusCountListSchema,
} from "@/lib/schemas/dashboard";

import {
  ClientIdAuthSchema,
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const DashboardExtraParams = {
  ClientDate: z.string(),
  LocationId: z.string().optional(),
  MultipleLocation: z.array(z.string()).optional(),
};

const rootDashboardContract = c.router({
  getAdminMessages: {
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
  getWidgets: {
    method: "GET",
    path: "/v3/dashboard",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: DashboardWidgetItemListSchema,
      404: StructuredErrorSchema,
    },
  },
  saveWidget: {
    method: "POST",
    path: "/v3/dashboard",
    body: c.type<
      Omit<DashboardWidgetItemParsed, "widgetScale"> & {
        widgetScale: string;
        clientID: number;
        userID: number;
      }
    >(),
    responses: {
      200: z.any(),
      201: z.any(),
      400: StructuredErrorSchema,
    },
  },
});

export { rootDashboardContract };
