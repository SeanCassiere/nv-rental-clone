import { z } from "zod";

const VehicleTypeLookupSchema = z.object({
  id: z.number(),
  value: z.preprocess((val) => (val ? `${val}` : val), z.string()),
  hasVehicles: z.boolean(),
});

export type TVehicleTypeLookup = z.infer<typeof VehicleTypeLookupSchema>;
export const VehicleTypeLookupList = z.array(VehicleTypeLookupSchema);
