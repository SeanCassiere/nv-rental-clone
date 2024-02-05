import { z } from "zod";

const SaleStatusItem = z.object({
  monthName: z.preprocess((val) => val || "", z.string()),
  total: z.preprocess((val) => val || 0, z.number()),
  previousTotal: z.preprocess((val) => val || 0, z.number()),
});

export const SalesStatusParse = z.array(SaleStatusItem);
export type SalesStatusItemType = z.infer<typeof SaleStatusItem>;
