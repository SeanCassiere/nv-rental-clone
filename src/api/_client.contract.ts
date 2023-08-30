import { z } from "zod";

import { c } from "@/api/c";

import {
  ClientColumnHeadersListSchema,
  ClientFeatureListSchema,
  ClientProfileSchema,
  ClientScreenSettingListSchema,
  SaveClientColumnHeaderInfoResponseSchema,
  SaveClientColumnHeaderInfoSchema,
} from "@/schemas/client";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootClientContract = c.router({
  getProfile: {
    method: "GET",
    path: "/v3/clients/:clientId",
    responses: {
      200: ClientProfileSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getFeatures: {
    method: "POST",
    path: "/v3/clients/:clientId/clientfeatures",
    body: z.object({}).optional(),
    responses: {
      200: ClientFeatureListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getScreenSettings: {
    method: "GET",
    path: "/v3/clients/:clientId/screensettings",
    responses: {
      200: ClientScreenSettingListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getColumnHeaderInfo: {
    method: "GET",
    path: "/v3/clients/columnheaderinformation",
    query: UserAndClientIdAuthSchema.extend({
      module: z.enum(["customer", "vehicle", "reservation", "agreement"]),
    }),
    responses: {
      200: ClientColumnHeadersListSchema,
      401: UnauthorizedErrorSchema,
    },
  },
  saveColumnHeaderInfo: {
    method: "POST",
    path: "/v3/clients/columnheaderinformation",
    body: SaveClientColumnHeaderInfoSchema,
    responses: {
      200: SaveClientColumnHeaderInfoResponseSchema,
      401: UnauthorizedErrorSchema,
    },
  },
});

export { rootClientContract };
