import { z } from "zod";

const VehicleLevelListItemSchema = z.object({
  value: z.string(),
});

export type TVehicleLevelListItemParsed = z.infer<
  typeof VehicleLevelListItemSchema
>;
export const VehicleLevelListSchema = z.array(VehicleLevelListItemSchema);
