import { z } from "zod";
import { initContract } from "@ts-rest/core";

import {
  UserAndClientIdAuthSchema,
  StructuredErrorSchema,
  PaginationSchema,
} from "@/api/api.helpers";

import { AgreementListItemListSchema } from "@/schemas/agreement";
import {
  ClientFeatureListSchema,
  ClientProfileSchema,
  ClientScreenSettingListSchema,
} from "@/schemas/client";

const c = initContract();

const contract = c.router(
  {
    getAgreementsList: {
      method: "GET",
      path: "/v3/agreements",
      query: PaginationSchema.merge(UserAndClientIdAuthSchema).extend({
        currentDate: z.string(),
      }),
      responses: {
        200: AgreementListItemListSchema,
        404: StructuredErrorSchema,
      },
    },
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
  },
  {
    strictStatusCodes: true,
  }
);

export { contract };
