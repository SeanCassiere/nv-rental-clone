import { c } from "@/api/c";

import {
  PermissionListSchema,
  RoleListSchema,
  SingleRoleItemSchema,
} from "@/schemas/role";

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
  getById: {
    method: "GET",
    path: "/v3/roles/:roleId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: SingleRoleItemSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getPermissions: {
    method: "GET",
    path: "/v3/roles/permissions",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: PermissionListSchema,
      404: StructuredErrorSchema,
    },
  },
  deleteRole: {
    method: "DELETE",
    path: "/v3/roles/:roleId",
    body: c.type<never>(),
    responses: {},
  },
});

export { rootRolesContract };
