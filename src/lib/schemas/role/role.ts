import { z } from "zod";

import { PermissionListSchema } from "./permission";

export const RoleListItemSchema = z.object({
  createdBy: z.string().nullable(),
  description: z.string().nullable(),
  roleName: z.string(),
  type: z.number(),
  userRoleID: z.number(),
});
export type RoleListItem = z.infer<typeof RoleListItemSchema>;
export const RoleListSchema = z.array(RoleListItemSchema);

export const SingleRoleItemSchema = z.object({
  createdBy: z.string().nullable(),
  description: z.string().nullable(),
  roleName: z.string(),
  type: z.number(),
  userRoleID: z.number(),
  permissions: PermissionListSchema,
});
