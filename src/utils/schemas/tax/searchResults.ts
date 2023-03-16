import { z } from "zod";

export const TaxListItemSchema = z.object({
  activeDate: z.string().nullable(),
  description: z.string().nullable(),
  expiryDate: z.string().nullable(),
  id: z.number(),
  isDefaultSelectedForReservation: z.boolean().nullable().default(false),
  isOptional: z.boolean().nullable().default(true),
  locationId: z.number().nullable().default(0),
  locationName: z.string().nullable().default(""),
  locationTaxId: z.number().nullable().default(0),
  name: z.string().nullable().default(""),
  value: z.number().nullable().default(0),
});
export type TaxListItem = z.infer<typeof TaxListItemSchema>;
export const TaxListSchema = z.array(TaxListItemSchema);
