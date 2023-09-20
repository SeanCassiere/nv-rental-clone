import { z } from "zod";

export const PermissionListItemSchema = z.object({
  functionID: z.number(),
  functionCode: z.string(),
  description: z.string().nullable(),
  displayName: z.string().nullable(),
  systemFunctionCategory: z.number(),
});
export type PermissionListItem = z.infer<typeof PermissionListItemSchema>;
export const PermissionListSchema = z.array(PermissionListItemSchema);
