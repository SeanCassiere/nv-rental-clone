import { c } from "@/api/c";
import {
  UserAndClientIdAuthSchema,
  ClientIdAuthSchema,
  StringArraySchema,
} from "./helpers";
import { UserLanguageListSchema } from "@/schemas/user";

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
});

export { rootUserContract };
