import { z } from "zod";
import { initContract } from "@ts-rest/core";

import {
  ClientIdAuthSchema,
  UserAndClientIdAuthSchema,
  StructuredErrorSchema,
  PaginationSchema,
  StringArraySchema,
} from "@/api/helpers";

import { AgreementListItemListSchema } from "@/schemas/agreement";
import {
  ClientFeatureListSchema,
  ClientProfileSchema,
  ClientScreenSettingListSchema,
} from "@/schemas/client";
import { ColumnListItemListSchema } from "@/schemas/column";
import { UserLanguageListSchema } from "@/schemas/user";

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
    getClientColumnHeaderInformation: {
      method: "GET",
      path: "/v3/clients/columnheaderinformation",
      query: UserAndClientIdAuthSchema.extend({
        module: z.enum(["customer", "vehicle", "reservation", "agreement"]),
      }),
      responses: {
        200: ColumnListItemListSchema,
      },
    },
    getUserPermissionByUserId: {
      method: "GET",
      path: "/v3/users/:userId/permissions",
      query: ClientIdAuthSchema,
      responses: {
        200: StringArraySchema,
      },
    },
    getUserLanguages: {
      method: "GET",
      path: "/v3/users/language",
      query: UserAndClientIdAuthSchema,
      responses: {
        200: UserLanguageListSchema,
      },
    },
  },
  {
    strictStatusCodes: true,
  }
);

export { contract };
