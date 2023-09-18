import { z } from "zod";

import { c } from "@/api/c";

import {
  UpdateUserSchema,
  UserConfigurationsListSchema,
  UserLanguageListSchema,
  UserProfileSchema,
} from "@/schemas/user";

import {
  ClientIdAuthSchema,
  StringArraySchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootUserContract = c.router({
  getUserConfigurations: {
    method: "GET",
    path: "/v3/users/userconfiguration",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: UserConfigurationsListSchema,
      401: StructuredErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getProfileByUserId: {
    method: "GET",
    path: "/v3/users/:userId",
    query: UserAndClientIdAuthSchema.extend({ currentUserId: z.string() }),
    responses: {
      200: UserProfileSchema,
      404: StructuredErrorSchema,
    },
  },
  getPermissionForUserId: {
    method: "GET",
    path: "/v3/users/:userId/permissions",
    query: ClientIdAuthSchema,
    responses: {
      200: StringArraySchema,
    },
  },
  getLanguages: {
    method: "GET",
    path: "/v3/users/language",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: UserLanguageListSchema,
    },
  },
  updateProfileByUserId: {
    method: "PUT",
    path: "/v3/users/:userId",
    body: UpdateUserSchema,
    responses: {
      200: z.any(),
      401: z.any(),
      403: z.any(),
    },
  },
});

export { rootUserContract };
