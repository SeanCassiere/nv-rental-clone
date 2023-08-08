import { z } from "zod";

import { c } from "@/api/c";
import {
  UserAndClientIdAuthSchema,
  ClientIdAuthSchema,
  StringArraySchema,
  StructuredErrorSchema,
} from "./helpers";
import {
  UpdateUserSchema,
  UserLanguageListSchema,
  UserProfileSchema,
} from "@/schemas/user";

const rootUserContract = c.router({
  getUserProfileById: {
    method: "GET",
    path: "/v3/users/:userId",
    query: UserAndClientIdAuthSchema.extend({ currentUserId: z.string() }),
    responses: {
      200: UserProfileSchema,
      404: StructuredErrorSchema,
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
  updateUserProfileById: {
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
