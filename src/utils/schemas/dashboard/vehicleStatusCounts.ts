import { z } from "zod";

const VehicleStatusCountSchema = z.object({
  name: z.string(),
  total: z.number(),
});
export const VehicleStatusCountListSchema = z.array(VehicleStatusCountSchema);
