import { z } from "zod";

const ReservationTypeSchema = z.object({
  typeId: z.number(),
  typeName: z.string(),
  calculationType: z.string().nullable(),
  // "laguages": null,
  isDefault: z.boolean().default(false).nullable(),
  abbreviation: z.string().nullable(),
  isFront: z.boolean().default(false).nullable(),
  isDeleted: z.boolean().default(false).nullable(),
  isPossibleDelete: z.boolean().default(false).nullable(),
  isAddedByCustomer: z.boolean().default(false).nullable(),
});
export type TReservationTypeSchema = z.infer<typeof ReservationTypeSchema>;
export const ReservationTypeArraySchema = z.array(ReservationTypeSchema);
