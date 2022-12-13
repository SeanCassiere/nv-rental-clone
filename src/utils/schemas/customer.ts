import { z } from "zod";

export const customerFiltersModel = z.object({
  active: z.boolean().default(true).optional(),
});
