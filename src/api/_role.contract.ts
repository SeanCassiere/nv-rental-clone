import { c } from "@/api/c";

import { RoleListSchema } from "@/schemas/role";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootRolesContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/roles",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: RoleListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootRolesContract };
