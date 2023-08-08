import { z } from "zod";

import { c } from "@/api/c";
import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";
import {
  ClientFeatureListSchema,
  ClientProfileSchema,
  ClientScreenSettingListSchema,
  ClientColumnHeadersListSchema,
  SaveClientColumnHeaderInfoSchema,
  SaveClientColumnHeaderInfoResponseSchema,
} from "@/schemas/client";

const rootClientContract = c.router({
  getClientProfile: {
    method: "GET",
    path: "/v3/clients/:clientId",
    responses: {
      200: ClientProfileSchema,
      404: StructuredErrorSchema,
    },
  },
  getClientFeatures: {
    method: "POST",
    path: "/v3/clients/:clientId/clientfeatures",
    body: z.object({}).optional(),
    responses: {
      200: ClientFeatureListSchema,
      404: StructuredErrorSchema,
    },
  },
  getClientScreenSettings: {
    method: "GET",
    path: "/v3/clients/:clientId/screensettings",
    responses: {
      200: ClientScreenSettingListSchema,
      404: StructuredErrorSchema,
    },
  },
  getClientColumnHeaderInformation: {
    method: "GET",
    path: "/v3/clients/columnheaderinformation",
    query: UserAndClientIdAuthSchema.extend({
      module: z.enum(["customer", "vehicle", "reservation", "agreement"]),
    }),
    responses: {
      200: ClientColumnHeadersListSchema,
    },
  },
  saveClientColumnHeaderInformation: {
    method: "POST",
    path: "/v3/clients/columnheaderinformation",
    body: SaveClientColumnHeaderInfoSchema,
    responses: {
      200: SaveClientColumnHeaderInfoResponseSchema,
    },
  },
});

export { rootClientContract };
