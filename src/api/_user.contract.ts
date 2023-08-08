import { c } from "@/api/c";
import {
  UserAndClientIdAuthSchema,
  ClientIdAuthSchema,
  StringArraySchema,
} from "./helpers";
import { UpdateUserSchema, UserLanguageListSchema } from "@/schemas/user";
import { z } from "zod";

const rootUserContract = c.router({
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
