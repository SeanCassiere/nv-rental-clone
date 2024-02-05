import { c } from "@/lib/api/c";
import {
  PermissionListSchema,
  RoleListSchema,
  SingleRoleItemSchema,
} from "@/lib/schemas/role";

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
  createRole: {
    method: "POST",
    path: "/v3/roles",
    body: c.type<{
      roleName: string;
      description: string;
      permissions: number[];
      clientId: string;
    }>(),
    responses: {
      200: c.type<number>(),
      201: c.type<any>(),
      400: StructuredErrorSchema,
    },
  },
  updateRolePermissions: {
    method: "PUT",
    path: "/v3/roles/:roleId/permissions",
    body: c.type<{
      roleName: string;
      description: string;
      addPermissions: number[];
      deletePermissions: number[];
      clientId: string;
    }>(),
    responses: {
      200: c.type<any>(),
      201: c.type<any>(),
      400: StructuredErrorSchema,
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
