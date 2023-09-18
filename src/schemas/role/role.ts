import { z } from "zod";

export const RoleListItemSchema = z.object({
  createdBy: z.string().nullable(),
  description: z.string().nullable(),
  roleName: z.string(),
  type: z.number(),
  userRoleID: z.number(),
});
export type RoleListItem = z.infer<typeof RoleListItemSchema>;
export const RoleListSchema = z.array(RoleListItemSchema);
