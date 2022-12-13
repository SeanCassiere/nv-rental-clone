import { z } from "zod";

export const customerFiltersModel = z.object({
  active: z.coerce.boolean().default(true).optional(),
});
